// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DexDealChecker} from "../contracts/DexDealChecker.sol";

/// @notice Pure-logic tests for DexDealChecker.
///         Tests ONLY _buildTensor and _decodeVerdict -- the two helpers
///         whose correctness can be verified without the Ritual testnet.
///
/// Run: forge test -vv
contract DexDealCheckerLogicTest is Test {
    DexDealCheckerHarness harness;

    function setUp() public {
        harness = new DexDealCheckerHarness();
    }

    // ─── _intToFloat32Bits / _float32BitsToInt round-trip ───────────────────

    function test_float32_roundTrip_positiveIntegers() public view {
        // Values our contract will actually encounter
        assertEq(harness.float32RoundTrip(0),      0,      "0");
        assertEq(harness.float32RoundTrip(1),      1,      "1");
        assertEq(harness.float32RoundTrip(2),      2,      "2");
        assertEq(harness.float32RoundTrip(51),     51,     "51");
        assertEq(harness.float32RoundTrip(100),    100,    "100");
        assertEq(harness.float32RoundTrip(520000), 520000, "520000");
        assertEq(harness.float32RoundTrip(177000), 177000, "177000");
        assertEq(harness.float32RoundTrip(151780), 151780, "151780");
    }

    function test_float32_roundTrip_negativeIntegers() public view {
        assertEq(harness.float32RoundTrip(-1),    -1,    "-1");
        assertEq(harness.float32RoundTrip(-500),  -500,  "-500");
        assertEq(harness.float32RoundTrip(-3000), -3000, "-3000");
    }

    // ─── _buildTensor ───────────────────────────────────────────────────────

    /// dtype=5 (FLOAT32) as confirmed from ritual-dapp-onnx skill.
    function test_buildTensor_packsFeaturesCorrectly() public view {
        int256[] memory features = new int256[](4);
        features[0] = 520000;  // liq/1000
        features[1] = 177000;  // vol/1000
        features[2] = 51;      // price_change*100
        features[3] = 151780;  // tx_count

        bytes memory tensor = harness.buildTensor(features);
        (uint8 dtype, uint16[] memory shape, int32[] memory values) =
            abi.decode(tensor, (uint8, uint16[], int32[]));

        assertEq(dtype, 5, "dtype must be FLOAT32=5");
        assertEq(shape.length, 2);
        assertEq(shape[0], 1);
        assertEq(shape[1], 4);

        // Values are IEEE 754 float32 bit-patterns -- round-trip back and check
        assertEq(harness.float32BitsToInt(values[0]), 520000);
        assertEq(harness.float32BitsToInt(values[1]), 177000);
        assertEq(harness.float32BitsToInt(values[2]), 51);
        assertEq(harness.float32BitsToInt(values[3]), 151780);
    }

    /// Solidity 0.8 checked-arithmetic does NOT cover explicit downcasts.
    /// int32(hugeInt256) truncates silently -- no revert.
    /// _buildTensor explicit-checks and reverts with FeatureOutOfInt32Range.
    function test_buildTensor_revertsOnOverflow() public {
        int256[] memory features = new int256[](4);
        features[0] = 925_081_507_533; // way beyond int32 max
        features[1] = 0;
        features[2] = 0;
        features[3] = 0;

        vm.expectRevert(
            abi.encodeWithSelector(
                DexDealChecker.FeatureOutOfInt32Range.selector,
                uint256(0),
                int256(925_081_507_533)
            )
        );
        harness.buildTensor(features);
    }

    function test_buildTensor_revertsOnNegativeOverflow() public {
        int256[] memory features = new int256[](1);
        features[0] = int256(type(int32).min) - 1; // one below int32 min

        vm.expectRevert(
            abi.encodeWithSelector(
                DexDealChecker.FeatureOutOfInt32Range.selector,
                uint256(0),
                int256(type(int32).min) - 1
            )
        );
        harness.buildTensor(features);
    }

    // ─── _decodeVerdict ─────────────────────────────────────────────────────
    // The model outputs a float score. _decodeVerdict does:
    //   floor(score) <= 0 -> RISKY (0)
    //   floor(score) == 1 -> FAIR (1)
    //   floor(score) >= 2 -> UNDERVALUED (2)
    // Thresholds: 0.5 and 1.5 (scores land near 0.01, 1.7, 2.1)

    function test_decodeVerdict_passesThrough() public view {
        // score 0.01 (thin market) -> RISKY (floor=0 -> 0)
        assertEq(harness.decodeVerdict(_f32ScoreTensor(1008981770)),  0, "0.01->RISKY");
        // score 1.7 (fair market) -> FAIR (floor=1 -> 1)
        assertEq(harness.decodeVerdict(_f32ScoreTensor(1071225242)),  1, "1.7->FAIR");
        // score 2.1 (dip buy) -> UNDERVALUED (floor=2 -> 2)
        assertEq(harness.decodeVerdict(_f32ScoreTensor(1074161254)),  2, "2.1->UNDERVALUED");
    }

    function test_decodeVerdict_clampsLow() public view {
        // Negative score (-1.5) -> RISKY
        assertEq(harness.decodeVerdict(_f32ScoreTensor(-1077936128)), 0, "neg->RISKY");
        // score 0.3 < 0.5 -> RISKY (floor=0 -> 0)
        assertEq(harness.decodeVerdict(_f32ScoreTensor(1050253722)),  0, "0.3->RISKY");
    }

    function test_decodeVerdict_clampsHigh() public view {
        assertEq(harness.decodeVerdict(_f32ScoreTensor(1077936128)),  2, "3.0->UNDERVALUED");
        assertEq(harness.decodeVerdict(_f32ScoreTensor(1120272384)),  2, "99.0->UNDERVALUED");
    }

    // ─── HTTP envelope decode (pure Solidity, no precompile needed) ─────────

    /// Verifies the two-layer decode used in checkToken().
    function test_httpEnvelopeDecode_twoLayers() public pure {
        bytes memory httpBody = bytes('{"summary":{"liquidity_usd":720592129.48}}');
        bytes memory innerTuple = abi.encode(
            uint16(200),
            new string[](0),
            new string[](0),
            httpBody,
            ""
        );
        bytes memory rawOutput = abi.encode(bytes("sim"), innerTuple);

        // Replicates checkToken()'s decode path exactly
        (, bytes memory httpOutput) = abi.decode(rawOutput, (bytes, bytes));
        (
            uint16 statusCode,
            ,
            ,
            bytes memory body,
            string memory errMsg
        ) = abi.decode(httpOutput, (uint16, string[], string[], bytes, string));

        assertEq(statusCode, 200);
        assertEq(bytes(errMsg).length, 0);
        assertEq(string(body), string(httpBody));
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    /// Build a RitualTensor with dtype=5 (FLOAT32) holding one float score
    /// encoded as its IEEE 754 int32 bit-pattern -- matches ONNX Gemm output.
    /// Bit-patterns pre-computed externally (Solidity has no float literals):
    ///   0.01 -> 1008981770,  1.7 -> 1071225242,  2.1 -> 1074161254
    ///  -1.5 -> -1077936128,  0.3 -> 1050253722,  3.0 -> 1077936128, 99.0 -> 1120272384
    function _f32ScoreTensor(int32 bits) internal pure returns (bytes memory) {
        uint16[] memory shape = new uint16[](2);
        shape[0] = 1;
        shape[1] = 1;
        int32[] memory vals = new int32[](1);
        vals[0] = bits;
        return abi.encode(uint8(5), shape, vals);
    }
}

/// @dev Harness that exposes DexDealChecker internals for direct testing.
contract DexDealCheckerHarness is DexDealChecker {
    function buildTensor(int256[] memory features) external pure returns (bytes memory) {
        return _buildTensor(features);
    }

    function decodeVerdict(bytes memory outTensor) external pure returns (uint8) {
        return _decodeVerdict(outTensor);
    }

    function intToFloat32Bits(int32 v) external pure returns (int32) {
        return _intToFloat32Bits(v);
    }

    function float32BitsToInt(int32 bits) external pure returns (int32) {
        return _float32BitsToInt(bits);
    }

    function float32RoundTrip(int32 v) external pure returns (int32) {
        return _float32BitsToInt(_intToFloat32Bits(v));
    }
}
