#!/usr/bin/env node
// scripts/fund-wallet.mjs
// Deposits RITUAL into your RitualWallet for the EOA that will call checkToken().
//
// KEY POINT (ritual-dapp-wallet skill):
//   For short-running async precompiles (HTTP = 0x0801), Ritual's reth checks
//   the RitualWallet balance of the EOA SIGNER of the transaction, not the
//   contract itself. So you must deposit for your EOA, not the contract.
//
// Usage:
//   node scripts/fund-wallet.mjs [--amount 0.05] [--lock 100000]
//
// Requires (.env):
//   PRIVATE_KEY=0x...
//   RITUAL_RPC_URL=https://rpc.ritualfoundation.org

import { createPublicClient, createWalletClient, http, defineChain, parseEther, formatEther } from 'viem';
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
const AMOUNT_ETHER = parseFloat(getArg('--amount', '0.05'));
const LOCK_BLOCKS  = BigInt(getArg('--lock', '100000')); // ~9.7h at 350ms/block

// ─── Load .env manually (no external deps) ──────────────────────────────────
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
  console.error('Error: .env file not found. Copy .env.example to .env and fill in PRIVATE_KEY.');
  process.exit(1);
}

const PRIVATE_KEY   = env.PRIVATE_KEY;
const RPC_URL       = env.RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org';
const RITUAL_WALLET = '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948';

if (!PRIVATE_KEY || PRIVATE_KEY === '') {
  console.error('Error: PRIVATE_KEY is empty in .env');
  process.exit(1);
}

const RITUAL_WALLET_ABI = [
  { name: 'deposit',   type: 'function', stateMutability: 'payable',
    inputs: [{ name: 'lockDuration', type: 'uint256' }], outputs: [] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'lockUntil', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
];

// ─── Setup clients ───────────────────────────────────────────────────────────
const ritualChain = defineChain({
  id: 1979,
  name: 'Ritual',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: 'Ritual Explorer', url: 'https://explorer.ritualfoundation.org' } },
});

const account      = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({ chain: ritualChain, transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, chain: ritualChain, transport: http(RPC_URL) });

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║        Trade Vision — Fund Wallet         ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('EOA (tx signer):', account.address);
  console.log('RitualWallet:   ', RITUAL_WALLET);
  console.log('');

  // Check current balance and lock
  const [balance, lockUntil, currentBlock] = await Promise.all([
    publicClient.readContract({
      address: RITUAL_WALLET, abi: RITUAL_WALLET_ABI,
      functionName: 'balanceOf', args: [account.address],
    }),
    publicClient.readContract({
      address: RITUAL_WALLET, abi: RITUAL_WALLET_ABI,
      functionName: 'lockUntil', args: [account.address],
    }),
    publicClient.getBlockNumber(),
  ]);

  console.log('Current balance:', formatEther(balance), 'RITUAL');
  console.log('Lock until block:', lockUntil.toString(), `(current: ${currentBlock})`);
  const locked = currentBlock < lockUntil;
  console.log('Locked:', locked ? `YES (${lockUntil - currentBlock} blocks remaining)` : 'NO');
  console.log('');

  // Decide whether to deposit
  const MIN_BALANCE = parseEther('0.01');
  if (balance >= MIN_BALANCE) {
    console.log('✓ Balance is sufficient (>= 0.01 RITUAL). No deposit needed.');
    console.log('  (Run with --amount X to force a deposit anyway)');
    return; // exit cleanly without process.exit()
  }

  console.log(`Depositing ${AMOUNT_ETHER} RITUAL with lock duration ${LOCK_BLOCKS} blocks…`);
  console.log('Note: lock is MONOTONIC -- new deposits only extend, never shorten the lock.');
  console.log('');

  const hash = await walletClient.writeContract({
    address: RITUAL_WALLET,
    abi: RITUAL_WALLET_ABI,
    functionName: 'deposit',
    args: [LOCK_BLOCKS],
    value: parseEther(AMOUNT_ETHER.toString()),
  });

  console.log('Tx submitted:', hash);
  console.log('Waiting for receipt…');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Confirmed in block:', receipt.blockNumber.toString());
  console.log('');

  // Check updated balance
  const [newBalance, newLock] = await Promise.all([
    publicClient.readContract({
      address: RITUAL_WALLET, abi: RITUAL_WALLET_ABI,
      functionName: 'balanceOf', args: [account.address],
    }),
    publicClient.readContract({
      address: RITUAL_WALLET, abi: RITUAL_WALLET_ABI,
      functionName: 'lockUntil', args: [account.address],
    }),
  ]);

  console.log('✓ New balance:', formatEther(newBalance), 'RITUAL');
  console.log('  Lock until block:', newLock.toString());
  console.log('');
  console.log('Next: node scripts/check-token.mjs --network ethereum --token 0xC02a…');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
