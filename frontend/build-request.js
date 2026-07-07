// Builds the pre-encoded HTTP precompile input + jq queries for
// DexDealChecker.checkToken(), client-side, so we're not burning gas
// encoding a 13-field struct on-chain.
//
// Requires: viem (loaded via CDN in index.html)

/**
 * @param {string} network       DexPaprika network ID (e.g. "ethereum", "solana")
 * @param {string} tokenAddress  contract/mint address of the token
 * @param {string} executorAddress  a live TEE executor (from executor-probe.js)
 * @param {bigint} [ttl=30n]    blocks until expiry (1-500; default 30)
 */
function buildDexPaprikaHttpInput(network, tokenAddress, executorAddress, ttl = 30n) {
  const url = `https://api.dexpaprika.com/networks/${network}/tokens/${tokenAddress}`;

  // encodeAbiParameters is global here via the viem UMD bundle loaded in index.html
  return window.viem.encodeAbiParameters(
    window.viem.parseAbiParameters(
      "address, bytes[], uint256, bytes[], bytes, string, uint8, string[], string[], bytes, uint256, uint8, bool"
    ),
    [
      executorAddress,   // 0: executor — teeAddress from TEEServiceRegistry
      [],                // 1: encryptedSecrets — empty, DexPaprika needs no key
      ttl,               // 2: ttl (blocks) — must be 1-500 per protocol
      [],                // 3: secretSignatures
      "0x",              // 4: userPublicKey (empty = plaintext response)
      url,               // 5: url
      1,                 // 6: method — 1 = GET (never 0 -- rejected by chain)
      [],                // 7: header keys — none needed, public API
      [],                // 8: header values
      "0x",              // 9: body — empty for GET
      0n,                // 10: dkmsKeyIndex — unused
      0,                 // 11: dkmsKeyFormat — unused
      false,             // 12: piiEnabled — unused, no secrets to inject
    ]
  );
}

// jq queries against DexPaprika's token response.
//
// Verified against the real schema from docs.dexpaprika.com/introduction:
// a GET to /networks/{network}/tokens/{address} returns
//   summary.liquidity_usd, summary["24h"].volume_usd,
//   summary["24h"].buys, summary["24h"].sells,
//   summary["24h"].last_price_usd_change
//
// SAFE SYNTAX RULES (do NOT deviate from these):
//   - Do NOT use `elif` -- not supported by Ritual JQ precompile
//   - Do NOT use `round`, `log`, `sqrt` -- math builtins not guaranteed
//   - Use `floor` only (proven to work in production)
//   - Always use `// 0` null-coalescing on every field access
//
// Features (calibrated for model weights [4e-6, 4e-6, 1e-3, 0]):
//   f[0] = liquidity_usd / 1000   (e.g. $3.0M → 3000)
//   f[1] = volume_usd_24h / 1000  (e.g. $40.8M → 40800)
//   f[2] = price_change_24h * 100 (e.g. +8.93% → 893)
//   f[3] = buys_24h + sells_24h   (e.g. 230012)
const DEFAULT_JQ_QUERIES = [
  '((.summary.liquidity_usd // 0) / 1000) | floor',
  '((.summary["24h"].volume_usd // 0) / 1000) | floor',
  '((.summary["24h"].last_price_usd_change // 0) * 100) | floor',
  '((.summary["24h"].buys // 0) + (.summary["24h"].sells // 0))'
];

const VERDICT_LABELS = ["Risky / thin liquidity", "Fair", "Momentum"];
const VERDICT_EMOJIS = ["🔴", "🟡", "🟢"];

// ─── Network selector ─────────────────────────────────────────────────────────
//
// DexPaprika covers 35+ chains through the same endpoint -- just swap the
// `network` string. The shape of token addresses differs by ecosystem:
//   EVM chains:  0x-prefixed hex, 42 chars (20 bytes)
//   Solana:      base58, typically 32-44 chars (no 0x prefix)
//   Tron:        base58check, 34 chars, starts with T
//   Near/etc:    account IDs (alphanumeric + dot/dash)

const NETWORK_OPTIONS = [
  // label, DexPaprika networkId, addressType
  { label: "Ethereum",  networkId: "ethereum", addressType: "evm"    },
  { label: "Base",      networkId: "base",     addressType: "evm"    },
  { label: "BNB Chain", networkId: "bsc",      addressType: "evm"    },
  { label: "Solana",    networkId: "solana",   addressType: "solana" },
];

/**
 * Validate a token address for the given DexPaprika networkId.
 * Returns { valid: true } or { valid: false, error: string }.
 *
 * @param {string} address   raw user input
 * @param {string} networkId DexPaprika network string
 * @returns {{ valid: boolean, error?: string }}
 */
function validateAddress(address, networkId) {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Address is required' };
  }
  const addr = address.trim();
  const network = NETWORK_OPTIONS.find(n => n.networkId === networkId);
  const addrType = network ? network.addressType : 'evm';

  if (addrType === 'evm') {
    // 0x-prefixed, 42 chars (20 bytes hex), case-insensitive
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      return {
        valid: false,
        error: `EVM address must be 0x-prefixed and 42 chars (e.g. 0xC02a…). Got: ${addr.slice(0, 10)}…`,
      };
    }
    return { valid: true };
  }

  if (addrType === 'solana') {
    // base58: alphanumeric excluding 0, O, I, l; typically 32-44 chars
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) {
      return {
        valid: false,
        error: `Solana address must be base58, 32–44 chars (no 0x prefix). Got: ${addr.slice(0, 10)}…`,
      };
    }
    return { valid: true };
  }

  if (addrType === 'tron') {
    // Tron base58check: starts with T, 34 chars
    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(addr)) {
      return {
        valid: false,
        error: `Tron address must start with T and be 34 chars (base58). Got: ${addr.slice(0, 10)}…`,
      };
    }
    return { valid: true };
  }

  if (addrType === 'hex64') {
    // Sui / 64-char hex with optional 0x prefix
    const stripped = addr.startsWith('0x') ? addr.slice(2) : addr;
    if (!/^[0-9a-fA-F]{64}$/.test(stripped)) {
      return {
        valid: false,
        error: `Sui address must be 64 hex chars (0x-prefixed or not). Got: ${addr.slice(0, 10)}…`,
      };
    }
    return { valid: true };
  }

  // Unknown type: pass through with a warning
  return { valid: true };
}

window.DexDealChecker = {
  buildDexPaprikaHttpInput,
  DEFAULT_JQ_QUERIES,
  VERDICT_LABELS,
  VERDICT_EMOJIS,
  NETWORK_OPTIONS,
  validateAddress,
};
