// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DexDealChecker} from "../contracts/DexDealChecker.sol";

/// @notice Deploys DexDealChecker to Ritual testnet (chain 1979).
///
/// Pre-flight:
///   1. Get testnet RITUAL: https://faucet.ritualfoundation.org
///   2. Copy .env.example to .env and fill in PRIVATE_KEY, RITUAL_RPC_URL
///   3. Run `forge install foundry-rs/forge-std` if you haven't already
///   4. Run `forge test -vv` first -- confirm tests pass before deploying
///
/// Deploy:
///   forge script script/Deploy.s.sol:DeployDexDealChecker \
///     --rpc-url ritual \
///     --broadcast \
///     --private-key $PRIVATE_KEY \
///     -vvvv
///
/// Verify (separate step, after deploy):
///   forge verify-contract \
///     --chain 1979 \
///     --watch \
///     --verifier custom \
///     --verifier-url "$RITUAL_VERIFIER_URL" \
///     --verifier-api-key unused \
///     <DEPLOYED_ADDRESS> \
///     contracts/DexDealChecker.sol:DexDealChecker
///
/// After deploy:
///   1. Fill CONTRACT_ADDRESS in .env
///   2. Run `node scripts/fund-wallet.mjs` to fund your RitualWallet
///      (required before checkToken() -- HTTP precompile fees come from there)
///   3. Run `node scripts/check-token.mjs --network ethereum --token 0xC02a...`
contract DeployDexDealChecker is Script {
    function run() external returns (DexDealChecker) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        DexDealChecker checker = new DexDealChecker();

        vm.stopBroadcast();

        console.log("DexDealChecker deployed to:", address(checker));
        console.log("Chain ID:", block.chainid);
        console.log("Block explorer: https://explorer.ritualfoundation.org/address/", address(checker));
        console.log("");
        console.log("Next steps:");
        console.log("  1. Set CONTRACT_ADDRESS in .env");
        console.log("  2. node scripts/fund-wallet.mjs");
        console.log("  3. node scripts/check-token.mjs --network ethereum --token <address>");

        return checker;
    }
}
