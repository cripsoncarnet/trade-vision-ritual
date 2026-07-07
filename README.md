# Trade Vision — Powered by Ritual 🤖📊

**Trade Vision** is an advanced, AI-powered decentralized application (DApp) that evaluates the health and momentum of DEX tokens (specifically optimized for Solana, Base, Ethereum, and BNB Smart Chain) entirely on-chain.

By leveraging the **Ritual Network's Execution Layer**, Trade Vision bridges the gap between smart contracts, real-world internet data, and machine learning inference. It fetches live market data, processes it through an ONNX model, and returns a definitive trading verdict (`🔴 Risky`, `🟡 Fair`, or `🟢 Momentum`) within a single, verifiable smart contract transaction.

---

## 🌟 Why Trade Vision? The Web3 Compute Problem

Historically, blockchains have faced two major bottlenecks:
1. **The Oracle Problem:** Smart contracts are isolated and cannot natively fetch data from standard Web2 APIs (like DexPaprika or DexScreener).
2. **The Compute Problem:** Running complex math, such as Machine Learning inference (neural networks, tensor operations), on the EVM is prohibitively expensive and often hits block gas limits.

**Trade Vision** solves both by utilizing **Ritual Precompiles**.

---

## 🏗️ Architecture & Data Flow

Ritual extends the standard Ethereum Virtual Machine (EVM) with specialized **Precompiles**. A precompile is a highly optimized function built directly into the blockchain node. 

When a user requests a token analysis on Trade Vision, the following flow occurs in **one transaction**:

1. **User Submission**: The user pastes a token address (e.g., `9cRCn9r...`) into the frontend. The frontend constructs the payload and submits a transaction to the `DexDealChecker.sol` contract.
2. **HTTP Fetch (Precompile `0x...801`)**: The smart contract calls the HTTP precompile. A decentralized Trusted Execution Environment (TEE) node intercepts this, makes an off-chain `GET` request to the DexPaprika API, and returns the raw JSON market data as bytes to the EVM.
3. **Data Parsing (Precompile `0x...802`)**: Raw JSON cannot be fed into an AI model. The contract passes the JSON and a set of `jq` queries to the JQ precompile. The TEE node parses the payload and extracts a clean, 4-element array of integers: `[Liquidity, Volume, Price Change, Tx Count]`.
4. **AI Inference (Precompile `0x...803`)**: Finally, the contract passes a HuggingFace Model ID (an ONNX file) and the integer array to the ONNX precompile. The TEE node downloads the model, runs a tensor multiplication (Gemm layer), and returns a final float `score`.
5. **Verdict Emission**: The Solidity contract evaluates the `score` (e.g., `< 0.5` = Risky, `>= 1.5` = Momentum) and emits a `Verdict` event. The frontend listens for this event and instantly displays the result to the user.

---

## 🧠 The AI Model Pipeline

Trade Vision uses an open, verifiable ONNX model hosted on HuggingFace. Currently, it implements a meticulously calibrated linear Gemm (General Matrix Multiplication) layer.

### Features & Weights
The JQ precompile normalizes the data before it hits the model:
- **`f[0]` On-chain Liquidity:** Scaled as `Liquidity USD / 1000`. Weight: `4e-6`
- **`f[1]` 24h Volume:** Scaled as `Volume USD / 1000`. Weight: `4e-6`
- **`f[2]` Price Change (24h):** Scaled as `Percentage * 100`. Weight: `1e-3`
- **`f[3]` Tx Count:** Passed as `buys + sells`, but weight is set to `0` (unused in the current model iteration to satisfy the `[1, 4]` tensor shape requirement).

### Training & Deployment (`scripts/`)
You can tweak the model's behavior without touching Solidity:
1. **Build:** Modify the `weights` array in `scripts/build_model.py`. Running this script generates a new `dex-deal-score.onnx` file and validates it against 11 rigorous test cases (ensuring micro-caps are penalized and momentum tokens are rewarded).
2. **Upload:** Use `scripts/upload-model.py` to push the new model directly to your HuggingFace repository.
3. **Update:** Copy the resulting commit SHA and update the `TEST_ONNX_MODEL_ID` variable in the frontend.

---

## 📂 Project Structure

```text
├── contracts/
│   └── DexDealChecker.sol       # Core Solidity contract orchestrating the 3 precompiles
├── frontend/
│   ├── index.html               # Modern, glassmorphism-inspired UI
│   ├── app.css                  # Custom styling system and animations
│   └── build-request.js         # Web3 interaction, JQ query definition, event listening
├── scripts/
│   ├── build_model.py           # Python script to construct the ONNX tensor graph
│   ├── upload-model.py          # HuggingFace API integration for seamless model deployment
│   ├── check-token.mjs          # CLI utility to run the entire pipeline without a browser
│   └── fund-wallet.mjs          # Helper script to distribute RITUAL tokens for testing
├── test/
│   └── DexDealChecker.t.sol     # Foundry test suite for contract validation
├── .env                         # Environment variables (Private Keys, HuggingFace Tokens)
└── foundry.toml                 # Foundry configuration
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18+) & `npm`
- **Foundry** (`forge` and `cast`) installed. [Installation Guide](https://book.getfoundry.sh/)
- **Python 3.8+** with `pip`
- A HuggingFace Account and Access Token.

### 2. Environment Configuration
Clone the repository and create your `.env` file:
```bash
git clone https://github.com/your-username/trade-vision.git
cd trade-vision
cp .env.example .env
```
Populate `.env` with your Ethereum Private Key and HuggingFace API Token.

### 3. Install Dependencies
```bash
# Install Node packages
npm install

# Install Python packages for ML
pip install onnx huggingface_hub
```

### 4. Running the Frontend Locally
The frontend requires no build steps. Serve it using `npx`:
```bash
npx serve frontend --listen 3000
```
Navigate to `http://localhost:3000` to interact with Trade Vision.

---

## 🧪 Testing the Pipeline (CLI)

Trade Vision includes robust CLI tools to test the Ritual pipeline directly, bypassing the UI. This is highly recommended for debugging gas limits or TEE execution errors.

```bash
# Test a Solana token (e.g., a meme coin)
node scripts/check-token.mjs --network solana --token 9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump

# Test an Ethereum token
node scripts/check-token.mjs --network eth --token 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```

The script will:
1. Probe the Ritual `TEEServiceRegistry` for an active HTTP executor.
2. Encode the calldata containing the API URL, JQ queries, and Model SHA.
3. Execute the transaction and trace the output, verifying that the gas usage remains within safe limits (target: < 2M gas).

---

## 🛠️ Modifying the Smart Contract

If you need to change the logic of how the score is evaluated (e.g., changing the thresholds for "Risky" vs "Momentum"), you can modify `contracts/DexDealChecker.sol`.

1. Make your changes in the `.sol` file.
2. Compile and test using Foundry:
   ```bash
   forge build
   forge test
   ```
3. Deploy the contract to the Ritual testnet and update the `CONTRACT_ADDRESS` in `frontend/index.html`.

---

## 🌍 Supported Networks

Trade Vision is specifically optimized and calibrated for the 4 most active blockchain networks. This targeted focus ensures the highest accuracy for the AI model when evaluating liquidity and volume.

**Supported Chains:**
- **Ethereum** (`eth`)
- **Solana** (`solana`)
- **Base** (`base`)
- **BNB Smart Chain** (`bsc`)

To analyze a token on a different network, simply select the desired network in the frontend dropdown, or pass it as an argument in the CLI:
```bash
node scripts/check-token.mjs --network <network_name> --token <address>
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
