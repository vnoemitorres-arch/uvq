import dotenv from "dotenv";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

dotenv.config();

export default {
  plugins: [hardhatVerify],
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun"
    }
  },
  networks: {
    sepolia: {
      type: "http",
      url: (process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com").trim(),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY.trim().startsWith("0x") ? process.env.PRIVATE_KEY.trim() : "0x" + process.env.PRIVATE_KEY.trim()] : []
    }
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || ""
    }
  },
  paths: {
    artifacts: "./artifacts_new",
    cache: "./cache_new",
    tests: {
      solidity: "./tests"
    }
  }
};
