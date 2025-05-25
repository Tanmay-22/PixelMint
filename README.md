

#  PixelMint

**PixelMint** is a decentralized NFT marketplace for pixel art, built using the **Internet Computer** and **Motoko**. It allows artists to mint, list, and trade their pixel-based digital art in the form of NFTs, providing a secure, scalable, and blockchain-native experience.

---

## 🚀 Features

* 🧱 Mint unique pixel art NFTs on-chain
* 🛍️ List, buy, and sell NFTs in a decentralized marketplace
* 🔐 Integrated wallet authentication
* 📦 Assets stored securely on the Internet Computer
* ⚡ Fast and scalable using ICP’s canister smart contracts
* 🌐 Web interface for:
  - 🔁 Trading NFTs
  - 💰 Checking token balances
  - 🚰 Token faucet to receive test tokens

---

## 🛠️ Tech Stack

* **Smart Contracts**: Motoko (Canister-based logic)
* **Blockchain**: Internet Computer Protocol (ICP)
* **Frontend**: HTML, CSS, JavaScript (or React if applicable)
* **Deployment**: DFX CLI (`dfx`)
* **Storage**: Internet Computer’s native canister storage

---

## 📦 Installation

1. **Install DFX SDK**
   Follow instructions at: [https://internetcomputer.org/docs/current/developer-docs/setup/install/](https://internetcomputer.org/docs/current/developer-docs/setup/install/)

2. **Clone the Repository**

   ```bash
   git clone https://github.com/Tanmay-22/PixelMint.git
   cd PixelMint
   ```

3. **Install NPM dependencies** (if using frontend with JS/React)

   ```bash
   npm install
   ```

---

## ⚙️ Local Development

1. **Start the DFX Local Network**

   ```bash
   dfx start --background
   ```

2. **Deploy Canisters**

   ```bash
   dfx deploy
   ```

3. **Access the App**

   Once deployed, access the frontend locally via the URL printed in your terminal (typically `http://localhost:4943/?canisterId=xyz...`).

---

## 🚀 Deployment on ICP Mainnet

> Make sure your identity is set and wallet has enough cycles.

1. **Authenticate**

   ```bash
   dfx identity use <your-identity>
   ```

2. **Deploy to Mainnet**

   ```bash
   dfx deploy --network ic
   ```

---

## 📸 Screenshots

![HomePage Screenshot](./Output/Screenshot%20(115).png)
![Token Faucet Screenshot](./Output/Screenshot%20(122).png)
![Minting NFT Screenshot](./Output/Screenshot%20(118).png)
![Minted NFT Screenshot](./Output/Screenshot%20(119).png)
![MyNFTs Screenshot](./Output/Screenshot%20(124).png)
![Market Screenshot](./Output/Screenshot%20(125).png)



---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo, open issues, or submit pull requests.

---
