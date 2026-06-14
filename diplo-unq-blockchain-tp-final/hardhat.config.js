import dotenv from "dotenv";
dotenv.config();

export default {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun"
    }
  },
  networks: {
    baseSepolia: {
      type: "http",
      url: (process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org").trim(),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY.trim().startsWith("0x") ? process.env.PRIVATE_KEY.trim() : "0x" + process.env.PRIVATE_KEY.trim()] : []
    }
  },
  paths: {
    artifacts: "./artifacts_new",
    cache: "./cache_new"
  }
};
