/**
 * diagnose.mjs — tests JQ and ONNX precompiles directly via eth_call
 * to isolate which step is failing in checkToken().
 *
 * Run: node scripts/diagnose.mjs
 */
import { createPublicClient, http, defineChain, encodeAbiParameters, decodeAbiParameters, parseAbiParameters, toHex } from 'viem';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dir = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dir, '..', '.env') });

const RPC_URL = process.env.RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org';
const ritualChain = defineChain({
  id: 1979,
  name: 'Ritual',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: 'Ritual Explorer', url: 'https://explorer.ritualfoundation.org' } },
});
const publicClient = createPublicClient({ chain: ritualChain, transport: http(RPC_URL) });

const JQ_PRECOMPILE  = '0x0000000000000000000000000000000000000803';
const ONNX_PRECOMPILE = '0x0000000000000000000000000000000000000800';

const ONNX_MODEL_ID = process.env.ONNX_MODEL_ID ||
  'hf/cripson01we/dex-deal-score/dex-deal-score.onnx@db184668e77580dcbfee13e796188950beb5901f';

// Real WETH response body (reduced) from earlier receipt decode
const WETH_JSON = JSON.stringify({
  id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  name: 'Wrapped Ether',
  symbol: 'WETH',
  summary: {
    chain: 'ethereum',
    price_usd: 1769.6,
    liquidity_usd: 520213213.25,
    '24h': {
      volume_usd: 176816743.22,
      buys: 71247,
      sells: 80533,
      last_price_usd_change: 0.35,
    }
  }
});

async function testJQ(query, json, label) {
  try {
    const data = encodeAbiParameters(
      [{ type: 'string' }, { type: 'string' }, { type: 'uint8' }],
      [query, json, 0] // 0 = JQ_OUT_INT256
    );
    const result = await publicClient.call({ to: JQ_PRECOMPILE, data });
    if (!result.data || result.data === '0x') {
      console.log(`  ✗ ${label}: empty result (precompile returned 0 bytes)`);
      return null;
    }
    const [value] = decodeAbiParameters([{ type: 'int256' }], result.data);
    console.log(`  ✓ ${label}: ${value}`);
    return value;
  } catch (e) {
    console.log(`  ✗ ${label}: REVERTED — ${e.message?.slice(0, 120)}`);
    return null;
  }
}

async function testONNX(modelId, features) {
  try {
    // Build FLOAT32 tensor
    function intToFloat32Bits(v) {
      const buf = new ArrayBuffer(4);
      new Float32Array(buf)[0] = v;
      return new Int32Array(buf)[0];
    }
    const float32Values = features.map(intToFloat32Bits);
    const tensorData = encodeAbiParameters(
      [{ type: 'uint8' }, { type: 'uint16[]' }, { type: 'int32[]' }],
      [5, [1, features.length], float32Values]
    );
    const modelIdBytes = toHex(new TextEncoder().encode(modelId));
    const data = encodeAbiParameters(
      [
        { type: 'bytes' },  // mlModelId
        { type: 'bytes' },  // tensorData
        { type: 'uint8' },  // inputArithmetic: 2=IEEE754
        { type: 'uint8' },  // inputFixedPointScale
        { type: 'uint8' },  // outputArithmetic
        { type: 'uint8' },  // outputFixedPointScale
        { type: 'uint8' },  // rounding
      ],
      [modelIdBytes, tensorData, 2, 0, 2, 0, 1]
    );
    const result = await publicClient.call({ to: ONNX_PRECOMPILE, data });
    if (!result.data || result.data === '0x') {
      console.log('  ✗ ONNX: empty result (model not cached or rejected)');
      return null;
    }
    // Decode outer envelope: (bytes tensor, uint8, uint8, uint8)
    const [tensorBytes] = decodeAbiParameters([{ type: 'bytes' }, { type: 'uint8' }, { type: 'uint8' }, { type: 'uint8' }], result.data);
    // Decode tensor: (uint8 dtype, uint16[] shape, int32[] values)
    const [dtype, shape, values] = decodeAbiParameters([{ type: 'uint8' }, { type: 'uint16[]' }, { type: 'int32[]' }], tensorBytes);
    // Convert float32 bits back to float
    const verdictBits = Number(values[0]);
    const buf = new ArrayBuffer(4);
    new Int32Array(buf)[0] = verdictBits;
    const verdictFloat = new Float32Array(buf)[0];
    const verdictInt = Math.round(verdictFloat);
    const labels = ['RISKY', 'FAIR', 'UNDERVALUED'];
    console.log(`  ✓ ONNX: dtype=${dtype} shape=[${shape}] raw_bits=${verdictBits} float=${verdictFloat.toFixed(1)} verdict=${verdictInt} (${labels[Math.max(0,Math.min(2,verdictInt))]})`);
    return verdictInt;
  } catch (e) {
    console.log(`  ✗ ONNX: REVERTED — ${e.message?.slice(0, 200)}`);
    return null;
  }
}

async function main() {
  const block = await publicClient.getBlockNumber();
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║    DexDealChecker Diagnostics         ║`);
  console.log(`╚══════════════════════════════════════╝`);
  console.log(`\nBlock: ${block}  RPC: ${RPC_URL}\n`);

  console.log('── Step 1: JQ precompile (sync, no wallet needed) ──────────────');
  console.log('Testing against embedded WETH JSON sample:\n');
  const liq  = await testJQ('(.summary.liquidity_usd / 1000) | floor',                              WETH_JSON, 'liq/1000');
  const vol  = await testJQ('(.summary["24h"].volume_usd / 1000) | floor',                          WETH_JSON, 'vol/1000 (bracket key)');
  const vol2 = await testJQ('(.summary | .["24h"] | .volume_usd) | (. / 1000) | floor',             WETH_JSON, 'vol/1000 (pipe chain)');
  const pchg = await testJQ('(.summary["24h"].last_price_usd_change * 100) | floor',                WETH_JSON, 'price_change*100');
  const txns = await testJQ('(.summary["24h"].buys + .summary["24h"].sells)',                        WETH_JSON, 'buys+sells');
  const liq2 = await testJQ('.summary.liquidity_usd | floor',                                        WETH_JSON, 'liq raw (no division)');

  console.log('\n── Step 2: ONNX precompile (sync) ──────────────────────────────');
  console.log(`Model: ${ONNX_MODEL_ID}\n`);

  // Test with WETH-like features
  const f0 = liq  !== null ? Number(liq)  : 520000;
  const f1 = vol  !== null ? Number(vol)  : 177000;
  const f2 = pchg !== null ? Number(pchg) : 51;
  const f3 = txns !== null ? Number(txns) : 151780;
  console.log(`  Features: [${f0}, ${f1}, ${f2}, ${f3}] (liq/1k, vol/1k, pchg*100, txns)`);
  await testONNX(ONNX_MODEL_ID, [f0, f1, f2, f3]);

  // Also test with the Ritual test model to confirm ONNX precompile itself works
  console.log('\n── Step 2b: Ritual test model (linreg 10 floats, confirms precompile is up) ──');
  const testModelId = 'hf/Ritual-Net/sample_linreg/linreg_10_features.onnx@fd0501654c4144a9900a670c5c9a074b6bd3d4ef';
  console.log(`  Model: ${testModelId}`);
  await testONNX(testModelId, [0.5, -0.14, 0.65, 1.52, -0.23, -0.23, 1.58, 0.77, -0.47, 0.54].map(v => v * 1)); // note: 10 inputs
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
