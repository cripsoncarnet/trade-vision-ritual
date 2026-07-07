// frontend/executor-probe.js
// Executor liveness probe for DexDealChecker.
//
// There is NO on-chain "list live executors" call on Ritual (confirmed from
// ritual-dapp-contracts skill). TEEServiceRegistry exposes per-ID lookups and
// indexed capability APIs. This module wraps those into a single
// `pickLiveExecutor()` function that returns a ready-to-use teeAddress.
//
// Requires: viem UMD bundle loaded in index.html before this file.

(function () {
  'use strict';

  const TEE_SERVICE_REGISTRY = '0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F';
  const HTTP_CALL_CAPABILITY = 0; // from ritual-dapp-contracts: HTTP_CALL=0

  // ─── ABI fragments needed from TEEServiceRegistry ─────────────────────────

  const REGISTRY_ABI = [
    // pickServiceByCapability: preferred path when index is finalized
    {
      name: 'pickServiceByCapability',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'capability', type: 'uint8' },
        { name: 'checkValidity', type: 'bool' },
        { name: 'seed', type: 'uint256' },
        { name: 'maxProbes', type: 'uint256' },
      ],
      outputs: [
        { name: 'teeAddress', type: 'address' },
        { name: 'found', type: 'bool' },
      ],
    },
    // getCapabilityIndexStatus: tells us if the indexed APIs are ready
    {
      name: 'getCapabilityIndexStatus',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [
        { name: 'cursor', type: 'uint256' },
        { name: 'total', type: 'uint256' },
        { name: 'initialized', type: 'bool' },
        { name: 'finalized', type: 'bool' },
      ],
    },
    // getServicesByCapability: fallback when index is not finalized
    {
      name: 'getServicesByCapability',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'capability', type: 'uint8' },
        { name: 'checkValidity', type: 'bool' },
      ],
      outputs: [{
        type: 'tuple[]',
        components: [
          {
            name: 'node', type: 'tuple', components: [
              { name: 'paymentAddress', type: 'address' },
              { name: 'teeAddress', type: 'address' },
              { name: 'teeType', type: 'uint8' },
              { name: 'publicKey', type: 'bytes' },
              { name: 'endpoint', type: 'string' },
              { name: 'certPubKeyHash', type: 'bytes32' },
              { name: 'capability', type: 'uint8' },
            ],
          },
          { name: 'isValid', type: 'bool' },
          { name: 'workloadId', type: 'bytes32' },
        ],
      }],
    },
    // getService: single-executor lookup for liveness check
    {
      name: 'getService',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'addr', type: 'address' },
        { name: 'checkValidity', type: 'bool' },
      ],
      outputs: [{
        type: 'tuple',
        components: [
          {
            name: 'node', type: 'tuple', components: [
              { name: 'paymentAddress', type: 'address' },
              { name: 'teeAddress', type: 'address' },
              { name: 'teeType', type: 'uint8' },
              { name: 'publicKey', type: 'bytes' },
              { name: 'endpoint', type: 'string' },
              { name: 'certPubKeyHash', type: 'bytes32' },
              { name: 'capability', type: 'uint8' },
            ],
          },
          { name: 'isValid', type: 'bool' },
          { name: 'workloadId', type: 'bytes32' },
        ],
      }],
    },
  ];

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Pick a live HTTP executor from the TEEServiceRegistry.
   *
   * Strategy (per ritual-dapp-contracts):
   *   1. Check if the indexed state is finalized.
   *   2. If finalized: use pickServiceByCapability(seed=random, maxProbes=5).
   *   3. If not finalized: fall back to getServicesByCapability and take [0].
   *
   * @param {object} publicClient  viem PublicClient connected to Ritual chain
   * @returns {Promise<{teeAddress: string, publicKey: string}>}
   * @throws  if no valid executor is found
   */
  async function pickLiveExecutor(publicClient) {
    const { viem } = window;

    // Step 1: check index status
    const indexStatus = await publicClient.readContract({
      address: TEE_SERVICE_REGISTRY,
      abi: REGISTRY_ABI,
      functionName: 'getCapabilityIndexStatus',
      args: [],
    });
    const finalized = indexStatus[3]; // [cursor, total, initialized, finalized]

    let teeAddress;
    let publicKey = '0x';

    if (finalized) {
      // Preferred path: bounded random selection
      const seed = BigInt(Date.now()); // good enough entropy for executor selection
      const [addr, found] = await publicClient.readContract({
        address: TEE_SERVICE_REGISTRY,
        abi: REGISTRY_ABI,
        functionName: 'pickServiceByCapability',
        args: [HTTP_CALL_CAPABILITY, true, seed, 5n],
      });
      if (!found || addr === viem.zeroAddress) {
        throw new Error('No live HTTP executor found via pickServiceByCapability');
      }
      teeAddress = addr;

      // Fetch public key from getService (pickServiceByCapability only returns address)
      const svc = await publicClient.readContract({
        address: TEE_SERVICE_REGISTRY,
        abi: REGISTRY_ABI,
        functionName: 'getService',
        args: [teeAddress, true],
      });
      publicKey = svc.node.publicKey;
    } else {
      // Fallback: enumerate and take first valid
      const services = await publicClient.readContract({
        address: TEE_SERVICE_REGISTRY,
        abi: REGISTRY_ABI,
        functionName: 'getServicesByCapability',
        args: [HTTP_CALL_CAPABILITY, true],
      });
      if (!services || services.length === 0) {
        throw new Error('No HTTP executors available (getServicesByCapability returned empty)');
      }
      const svc = services[0];
      teeAddress = svc.node.teeAddress;
      publicKey  = svc.node.publicKey;
    }

    return { teeAddress, publicKey };
  }

  /**
   * Verify that a specific executor address is valid and alive in the registry.
   *
   * @param {object} publicClient  viem PublicClient
   * @param {string} teeAddress    address to check
   * @returns {Promise<{alive: boolean, reason?: string}>}
   */
  async function checkExecutorLiveness(publicClient, teeAddress) {
    try {
      const svc = await publicClient.readContract({
        address: TEE_SERVICE_REGISTRY,
        abi: REGISTRY_ABI,
        functionName: 'getService',
        args: [teeAddress, true], // checkValidity=true
      });
      if (!svc.isValid) {
        return { alive: false, reason: 'Registry reports executor as invalid' };
      }
      if (!svc.node.teeAddress || svc.node.teeAddress === '0x0000000000000000000000000000000000000000') {
        return { alive: false, reason: 'Executor address is zero' };
      }
      return { alive: true };
    } catch (err) {
      return { alive: false, reason: String(err.message || err) };
    }
  }

  // Expose on window for index.html
  window.ExecutorProbe = { pickLiveExecutor, checkExecutorLiveness };
})();
