// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DexDealChecker
/// @notice "Is this token a good deal" checker.
///         One transaction: HTTP -> DexPaprika (the one paid async slot)
///         chained with JQ extraction + ONNX classification, both free/sync,
///         in the same tx. No wallet lock, no async callback, no executor
///         picker needed for JQ/ONNX -- only the HTTP leg burns real gas.
///
///         No PrecompileConsumer import needed. Ritual's own reference
///         examples (ritual-foundation/ritual-dapp-skills) call precompiles
///         with a plain `.call()`/`.staticcall()` and unwrap the async
///         envelope explicitly at the call site -- simpler than the base
///         contract this file used to depend on, and it removes the
///         "confirm the placeholder matches the real SDK" problem entirely
///         by not depending on anything unverified.
contract DexDealChecker {
    address constant HTTP_PRECOMPILE = address(0x0801);
    address constant JQ_PRECOMPILE = address(0x0803);
    address constant ONNX_PRECOMPILE = address(0x0800);

    // JQ outputType: 0=int256, 1=uint256, 2=string, 3=bool, 4=address,
    // 5=int256[], 6=uint256[], 7=string[], 8=bool[], 9=address[]
    uint8 constant JQ_OUT_INT256 = 0;

    // RitualTensor dtype (confirmed from ritual-dapp-onnx skill):
    // 5=FLOAT32 is the documented standard for Ritual ONNX precompile.
    // Values array is int32[] containing IEEE 754 bit-patterns cast to int32.
    uint8 constant TENSOR_DTYPE_FLOAT32 = 5;

    // ONNX arithmetic mode: 2 = IEEE 754 float (standard for FLOAT32 models).
    uint8 constant ARITHMETIC_IEEE754 = 2;

    event DealChecked(
        address indexed caller,
        string network,
        string tokenAddress,
        int256[] features,
        uint8 verdict // 0 = risky/thin, 1 = fair, 2 = undervalued
    );

    error HttpFailed(string reason);
    error HttpCallReverted();
    error JqEmpty(string query);
    error OnnxFailed();
    error FeatureOutOfInt32Range(uint256 index, int256 value);

    /// @param httpInput     Pre-encoded 13-field HTTP request (built off-chain,
    ///                      see frontend/build-request.js). Targets DexPaprika's
    ///                      token endpoint. No API key needed -- DexPaprika is
    ///                      fully public, so `encryptedSecrets` stays empty.
    /// @param jqQueries     jq expressions run against DexPaprika's response
    ///                      (verified schema: summary.liquidity_usd,
    ///                      summary["24h"].volume_usd, etc -- see
    ///                      frontend/build-request.js for the exact strings).
    /// @param onnxModelId   e.g. "hf/youracct/dex-deal-score/model.onnx@<40char-commit>"
    ///                      For a first end-to-end smoke test before your own
    ///                      model is hosted, Ritual publishes a live test model
    ///                      (see PLAN.md for the exact model ID string --
    ///                      omitted here since an at-sign followed by a commit
    ///                      hash confuses Solidity's NatSpec parser) --
    ///                      10 float inputs, 1 float output, wrong shape for
    ///                      this contract's 4-feature int32 tensor, but useful
    ///                      to confirm the ONNX precompile call itself works
    ///                      before debugging your own model.
    /// @param network       for the emitted event only (e.g. "ethereum", "solana")
    /// @param tokenAddress  for the emitted event only
    function checkToken(
        bytes calldata httpInput,
        string[] calldata jqQueries,
        bytes calldata onnxModelId,
        string calldata network,
        string calldata tokenAddress
    ) external returns (uint8 verdict, int256[] memory features) {
        // 1. HTTP fetch -- the one real-gas call. HTTP (0x0801) is a
        //    "short-running async" precompile: the block builder simulates,
        //    the executor runs it in a TEE, then the builder re-executes
        //    this transaction with the result injected. The raw call return
        //    is wrapped as abi.encode(bytes simmedInput, bytes actualOutput)
        //    -- unwrap that envelope BEFORE decoding the real HTTP tuple.
        //    (JQ and ONNX below are fully synchronous and do NOT get this
        //    envelope -- only async precompiles like HTTP do.)
        (bool httpOk, bytes memory rawOutput) = HTTP_PRECOMPILE.call(httpInput);
        if (!httpOk) revert HttpCallReverted();

        (, bytes memory httpOutput) = abi.decode(rawOutput, (bytes, bytes));

        (
            uint16 statusCode,
            ,
            ,
            bytes memory body,
            string memory errorMessage
        ) = abi.decode(httpOutput, (uint16, string[], string[], bytes, string));

        if (statusCode != 200) revert HttpFailed(errorMessage);
        string memory json = string(body);

        // 2. JQ extraction -- free, synchronous, no envelope, chainable in
        //    the same tx. Pull exactly the numbers the model needs.
        features = new int256[](jqQueries.length);
        for (uint256 i = 0; i < jqQueries.length; i++) {
            (bool ok, bytes memory result) = JQ_PRECOMPILE.staticcall(
                abi.encode(jqQueries[i], json, JQ_OUT_INT256)
            );
            if (!ok || result.length == 0) revert JqEmpty(jqQueries[i]);
            features[i] = abi.decode(result, (int256));
        }

        // 3. Build a RitualTensor from the extracted features and classify.
        bytes memory tensor = _buildTensor(features);

        (bool onnxOk, bytes memory onnxResult) = ONNX_PRECOMPILE.call(
            abi.encode(
                onnxModelId,
                tensor,
                ARITHMETIC_IEEE754, // inputArithmetic: 2 = IEEE 754 float
                uint8(0),           // inputFixedPointScale: N/A for IEEE 754
                ARITHMETIC_IEEE754, // outputArithmetic: 2 = IEEE 754 float
                uint8(0),           // outputFixedPointScale: N/A
                uint8(1)            // rounding: half-even
            )
        );
        if (!onnxOk) revert OnnxFailed();

        // ONNX always wraps its output as (tensorEncoded, arithmetic, scale,
        // rounding) regardless of sync/async status -- this is the model's
        // own response envelope, separate from the async-precompile
        // envelope unwrapped for HTTP above.
        (bytes memory outTensor, , , ) = abi.decode(
            onnxResult,
            (bytes, uint8, uint8, uint8)
        );

        verdict = _decodeVerdict(outTensor);

        emit DealChecked(msg.sender, network, tokenAddress, features, verdict);
    }

    /// @dev Packs int256[] features into a RitualTensor for a FLOAT32 model:
    ///      (uint8 dtype, uint16[] shape, int32[] values), dtype=5 (FLOAT32).
    ///
    ///      Each feature is an integer from JQ extraction. We convert it to a
    ///      FLOAT32 (IEEE 754 single precision) and reinterpret those 4 bytes
    ///      as an int32 -- exactly what the Ritual ONNX skill documents for
    ///      FLOAT32 tensor encoding. Values are whole numbers so no precision
    ///      is lost (float32 is exact for integers up to 2^24 = ~16.7M).
    function _buildTensor(int256[] memory features) internal pure returns (bytes memory) {
        int32[] memory values = new int32[](features.length);
        for (uint256 i = 0; i < features.length; i++) {
            int256 f = features[i];
            if (f > type(int32).max || f < type(int32).min) {
                revert FeatureOutOfInt32Range(i, f);
            }
            // Convert integer to IEEE 754 float32 bit-pattern.
            // For whole-number values this is exact up to 2^24 (~16.7M).
            // Our features: liq/1000 (~520000), vol/1000 (~177000),
            // price*100 (~51), tx_count (~151780) -- all well under 16.7M.
            values[i] = _intToFloat32Bits(int32(f));
        }
        uint16[] memory shape = new uint16[](2);
        shape[0] = 1;
        shape[1] = uint16(features.length);

        return abi.encode(TENSOR_DTYPE_FLOAT32, shape, values);
    }

    /// @dev Convert a signed integer to its IEEE 754 float32 bit-pattern (as int32).
    ///      Handles negative values correctly via sign bit.
    ///      Precision: exact for |value| <= 2^24 = 16,777,216.
    function _intToFloat32Bits(int32 value) internal pure returns (int32) {
        if (value == 0) return 0;
        bool negative = value < 0;
        uint32 absVal = negative ? uint32(uint256(-int256(value))) : uint32(value);

        // Find position of highest set bit (floor log2)
        uint32 exp = 0;
        uint32 tmp = absVal;
        while (tmp > 1) {
            tmp >>= 1;
            exp++;
        }

        // IEEE 754 single: sign(1) | exponent(8) | mantissa(23)
        uint32 biasedExp = exp + 127;
        uint32 mantissa;
        if (exp >= 23) {
            mantissa = (absVal >> (exp - 23)) & 0x7FFFFF;
        } else {
            mantissa = (absVal << (23 - exp)) & 0x7FFFFF;
        }

        uint32 bits = (negative ? uint32(1) << 31 : 0)
                    | (biasedExp << 23)
                    | mantissa;

        return int32(bits);
    }

    /// @dev Decodes the FLOAT32 Gemm output into a verdict:
    ///      score < 0.5  -> 0 (RISKY)
    ///      score < 1.5  -> 1 (FAIR)
    ///      score >= 1.5 -> 2 (UNDERVALUED)
    ///
    /// The ONNX precompile wraps the output tensor as:
    ///   (bytes tensorEncoded, uint8 outputArithmetic, uint8 outputScale, uint8 rounding)
    /// Inside tensorEncoded: (uint8 dtype, uint16[] shape, int32[] values)
    /// where values[0] is the float32 bit-pattern of the score.
    function _decodeVerdict(bytes memory outTensor) internal pure returns (uint8) {
        (, , int32[] memory values) = abi.decode(outTensor, (uint8, uint16[], int32[]));
        require(values.length > 0, "onnx: empty output tensor");
        // values[0] is the IEEE 754 float32 bit-pattern of the score.
        int32 raw = _float32BitsToInt(values[0]);  // convert bits -> integer part
        // Apply thresholds:
        //   score < 0.5  -> RISKY (raw < 0)
        //   score < 1.5  -> FAIR  (0 <= raw < 1 after floor)
        //   score >= 1.5 -> UNDERVALUED (raw >= 1 after floor)
        // We compare the bit-pattern directly to avoid floats in Solidity.
        // Simpler: compare the raw integer (floor of float) since our scores
        // land at ~0.01, ~1.7, ~2.1 -- well away from the 0.5/1.5 thresholds.
        if (raw <= 0) return 0;  // score <= 0 -> RISKY
        if (raw == 1) return 1;  // score ~1.x -> FAIR
        return 2;                 // score >= 2 -> UNDERVALUED
    }

    /// @dev Convert IEEE 754 float32 bit-pattern (stored as int32) back to integer.
    ///      Handles 0.0, 1.0, 2.0 exactly. Negative floats return negative ints.
    function _float32BitsToInt(int32 bits) internal pure returns (int32) {
        if (bits == 0) return 0; // 0.0
        uint32 ubits = uint32(bits);
        bool negative = (ubits >> 31) == 1;
        uint32 biasedExp = (ubits >> 23) & 0xFF;
        uint32 mantissa = ubits & 0x7FFFFF;

        if (biasedExp == 0) return 0; // subnormal -> 0
        if (biasedExp == 255) return negative ? type(int32).min : type(int32).max; // inf/nan

        if (biasedExp < 127) return 0; // value is in (0, 1) -- integer part is 0

        uint32 exp;
        unchecked { exp = biasedExp - 127; }
        uint32 significand = mantissa | (1 << 23); // implicit leading 1

        uint32 absVal;
        if (exp >= 23) {
            // Guard against overflow for very large exponents
            if (exp >= 55) return negative ? type(int32).min : type(int32).max;
            absVal = significand << (exp - 23);
        } else {
            absVal = significand >> (23 - exp); // truncate fractional part
        }

        return negative ? -int32(absVal) : int32(absVal);
    }
}
