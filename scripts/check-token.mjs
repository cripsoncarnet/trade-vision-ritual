#!/usr/bin/env node
// scripts/check-token.mjs
// CLI end-to-end call: executor probe → checkToken() → DealChecked event.
//
// Step 5 (smoke test): uses Ritual's PUBLIC TEST MODEL so you can confirm the
//   HTTP → JQ → ONNX plumbing works before your own model is uploaded to HF.
//   Once your model is ready, pass --onnx-model-id 'hf/you/repo/model.onnx@<sha>'
//
// Usage:
//   node scripts/check-token.mjs --network ethereum --token 0xC02aAA...
//   node scripts/check-token.mjs --network solana --token So1111...
//   node scripts/check-token.mjs --network ethereum --token 0xC02a... \
//       --onnx-model-id 'hf/youracct/dex-deal-score/model.onnx@<40-char-sha>'
//
// Requires (.env):
//   PRIVATE_KEY=0x...
//   RITUAL_RPC_URL=https://rpc.ritualfoundation.org
//   CONTRACT_ADDRESS=0x...   ← fill in after Deploy.s.sol

import {
  createPublicClient, createWalletClient, http, defineChain,
  encodeAbiParameters, parseAbiParameters, decodeEventLog,
  encodeFunctionData, formatEther, toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Parse CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

const NETWORK       = getArg('--network', 'ethereum');
const TOKEN_ADDRESS = getArg('--token', '');
const ONNX_MODEL_ID = getArg(
  '--onnx-model-id',
  // Ritual's public test model -- real commit hash from HuggingFace API.
  // Shape: 10 float inputs, 1 float output (wrong shape for this contract's
  // 4-int32 tensor, but confirms the ONNX precompile plumbing works).
  'hf/cripson01we/dex-deal-score/dex-deal-score.onnx@0f7c39e7343ff247f50759ff439d885c76303f76'
);

if (!TOKEN_ADDRESS) {
  console.error('Error: --token is required');
  console.error('Usage: node scripts/check-token.mjs --network ethereum --token 0xC02a…');
  process.exit(1);
}

// ─── Load .env ──────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '..', '.env');

let env = {};
try {
  const envFile = readFileSync(envPath, 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
} catch {
  console.error('Error: .env not found. cp .env.example .env and fill in values.');
  process.exit(1);
}

const PRIVATE_KEY        = env.PRIVATE_KEY;
const RPC_URL            = env.RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org';
const CONTRACT_ADDRESS   = env.CONTRACT_ADDRESS || '';

if (!PRIVATE_KEY) { console.error('PRIVATE_KEY missing in .env'); process.exit(1); }
if (!CONTRACT_ADDRESS) { console.error('CONTRACT_ADDRESS missing in .env — deploy first'); process.exit(1); }

// ─── System contract addresses ───────────────────────────────────────────────
const TEE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';
const EXPLORER_URL = 'https://explorer.ritualfoundation.org';

// ─── ABIs ────────────────────────────────────────────────────────────────────
const REGISTRY_ABI = [
  { name: 'getCapabilityIndexStatus', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [
      { name: 'cursor', type: 'uint256' }, { name: 'total', type: 'uint256' },
      { name: 'initialized', type: 'bool' }, { name: 'finalized', type: 'bool' },
    ]},
  { name: 'pickServiceByCapability', type: 'function', stateMutability: 'view',
    inputs: [
      { name: 'capability', type: 'uint8' }, { name: 'checkValidity', type: 'bool' },
      { name: 'seed', type: 'uint256' }, { name: 'maxProbes', type: 'uint256' },
    ],
    outputs: [{ name: 'teeAddress', type: 'address' }, { name: 'found', type: 'bool' }]},
  { name: 'getServicesByCapability', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'capability', type: 'uint8' }, { name: 'checkValidity', type: 'bool' }],
    outputs: [{ type: 'tuple[]', components: [
      { name: 'node', type: 'tuple', components: [
        { name: 'paymentAddress', type: 'address' }, { name: 'teeAddress', type: 'address' },
        { name: 'teeType', type: 'uint8' }, { name: 'publicKey', type: 'bytes' },
        { name: 'endpoint', type: 'string' }, { name: 'certPubKeyHash', type: 'bytes32' },
        { name: 'capability', type: 'uint8' },
      ]},
      { name: 'isValid', type: 'bool' }, { name: 'workloadId', type: 'bytes32' },
    ]}]},
];

const CHECKER_ABI = [
  { name: 'checkToken', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'httpInput',     type: 'bytes'    },
      { name: 'jqQueries',    type: 'string[]' },
      { name: 'onnxModelId',  type: 'bytes'    },
      { name: 'network',      type: 'string'   },
      { name: 'tokenAddress', type: 'string'   },
    ],
    outputs: [{ name: 'verdict', type: 'uint8' }, { name: 'features', type: 'int256[]' }]},
  { name: 'DealChecked', type: 'event',
    inputs: [
      { name: 'caller',       type: 'address',  indexed: true  },
      { name: 'network',      type: 'string',   indexed: false },
      { name: 'tokenAddress', type: 'string',   indexed: false },
      { name: 'features',     type: 'int256[]', indexed: false },
      { name: 'verdict',      type: 'uint8',    indexed: false },
    ]},
];

// JQ queries (must match frontend/build-request.js DEFAULT_JQ_QUERIES exactly)
// SAFE: only floor, no elif, no math builtins
const JQ_QUERIES = [
  '((.summary.liquidity_usd // 0) / 1000) | floor',
  '((.summary["24h"].volume_usd // 0) / 1000) | floor',
  '((.summary["24h"].last_price_usd_change // 0) * 100) | floor',
  '((.summary["24h"].buys // 0) + (.summary["24h"].sells // 0))',
];

const VERDICT_LABELS = ['🔴 Risky / thin liquidity', '🟡 Fair', '🟢 Momentum'];
const FEATURE_LABELS = ['Liquidity (/1000)', 'Volume 24h (/1000)', 'Price Δ (×100)', 'Tx Count 24h'];

// ─── Build HTTP input (13 fields, encoded for the precompile) ────────────────
function buildHttpInput(network, tokenAddress, executor) {
  const url = `https://api.dexpaprika.com/networks/${network}/tokens/${tokenAddress}`;
  return encodeAbiParameters(
    parseAbiParameters(
      'address, bytes[], uint256, bytes[], bytes, string, uint8, string[], string[], bytes, uint256, uint8, bool'
    ),
    [
      executor,
      [],
      30n,       // ttl: 30 blocks
      [],
      '0x',
      url,
      1,         // GET
      [],
      [],
      '0x',
      0n,
      0,
      false,
    ]
  );
}

// ─── Setup clients ───────────────────────────────────────────────────────────
const ritualChain = defineChain({
  id: 1979, name: 'Ritual',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: 'Ritual Explorer', url: EXPLORER_URL } },
});

const account      = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({ chain: ritualChain, transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, chain: ritualChain, transport: http(RPC_URL) });

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║         Trade Vision — Check Token            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
  console.log('Network:      ', NETWORK);
  console.log('Token:        ', TOKEN_ADDRESS);
  console.log('ONNX model:   ', ONNX_MODEL_ID);
  console.log('Contract:     ', CONTRACT_ADDRESS);
  console.log('Signer (EOA): ', account.address);
  console.log('');

  // ── Step 1: Pick executor ────────────────────────────────────────────────
  console.log('▶ Probing TEEServiceRegistry for a live HTTP executor…');
  let executor;

  const [, , , finalized] = await publicClient.readContract({
    address: TEE_REGISTRY, abi: REGISTRY_ABI,
    functionName: 'getCapabilityIndexStatus', args: [],
  });

  if (finalized) {
    const seed = BigInt(Date.now());
    const [teeAddr, found] = await publicClient.readContract({
      address: TEE_REGISTRY, abi: REGISTRY_ABI,
      functionName: 'pickServiceByCapability',
      args: [0, true, seed, 5n],
    });
    if (!found || teeAddr === '0x0000000000000000000000000000000000000000') {
      throw new Error('No live HTTP executor found via pickServiceByCapability');
    }
    executor = teeAddr;
  } else {
    const services = await publicClient.readContract({
      address: TEE_REGISTRY, abi: REGISTRY_ABI,
      functionName: 'getServicesByCapability', args: [0, true],
    });
    if (!services.length) throw new Error('No HTTP executors in registry');
    executor = services[0].node.teeAddress;
  }

  console.log('  Executor:', executor, '✓');
  console.log('');

  // ── Step 2: Build and send checkToken() ──────────────────────────────────
  const httpInput = buildHttpInput(NETWORK, TOKEN_ADDRESS, executor);
  const modelBytes = toHex(new TextEncoder().encode(ONNX_MODEL_ID));

  const callData = encodeFunctionData({
    abi: CHECKER_ABI, functionName: 'checkToken',
    args: [httpInput, JQ_QUERIES, modelBytes, NETWORK, TOKEN_ADDRESS],
  });

  console.log('▶ Sending checkToken() transaction…');
  const txHash = await walletClient.sendTransaction({
    to: CONTRACT_ADDRESS,
    data: callData,
    maxFeePerGas:         30_000_000_000n,
    maxPriorityFeePerGas:  2_000_000_000n,
    gas: 3_000_000n,
  });
  console.log('  Tx hash:', txHash);
  console.log(`  Explorer: ${EXPLORER_URL}/tx/${txHash}`);
  console.log('');
  console.log('▶ Waiting for settlement (HTTP is async — may take 5–60s)…');

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 180_000 });
  console.log('  Block:', receipt.blockNumber.toString(), '  Status:', receipt.status);
  console.log('');

  if (receipt.status === 'reverted') {
    console.error('✗ Transaction REVERTED.');
    console.error('  Common causes:');
    console.error('    - RitualWallet balance too low → run: node scripts/fund-wallet.mjs');
    console.error('    - Executor is dead → re-run to pick a different one');
    console.error('    - Wrong onnxModelId (model not downloaded yet, wait 1-5 blocks)');
    process.exit(1);
  }

  // ── Step 3: Parse DealChecked event ──────────────────────────────────────
  let verdict = null, features = [];
  for (const logEntry of receipt.logs) {
    try {
      const decoded = decodeEventLog({ abi: CHECKER_ABI, eventName: 'DealChecked', ...logEntry });
      verdict  = Number(decoded.args.verdict);
      features = decoded.args.features;
      break;
    } catch (_) {}
  }

  if (verdict === null) {
    console.error('✗ DealChecked event not found in receipt logs.');
    process.exit(1);
  }

  // ── Display result ────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════');
  console.log(`  Verdict: ${VERDICT_LABELS[Math.min(2, Math.max(0, verdict))]}`);
  console.log('═══════════════════════════════════════════════');
  if (features.length > 0) {
    console.log('  Features:');
    features.forEach((f, i) => {
      console.log(`    ${(FEATURE_LABELS[i] || `Feature ${i}`).padEnd(28)} ${f.toString()}`);
    });
  }
  console.log('');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
