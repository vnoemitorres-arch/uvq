import dotenv from "dotenv";
import hre from "hardhat";
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";

dotenv.config();

const contractAddress = process.env.CONTRACT_ADDRESS;
const rectorAddress = process.env.RECTOR_ADDRESS;

if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error("Falta ETHERSCAN_API_KEY en el archivo .env");
}
if (!contractAddress || !rectorAddress) {
  throw new Error("Faltan CONTRACT_ADDRESS o RECTOR_ADDRESS en el archivo .env");
}

await verifyContract(
  {
    address: contractAddress,
    constructorArgs: [rectorAddress],
    provider: "etherscan"
  },
  hre
);

console.log("✅ Contrato verificado en Etherscan Sepolia");
