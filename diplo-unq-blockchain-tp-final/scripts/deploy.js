import { ethers } from "ethers";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("Falta la PRIVATE_KEY en el archivo .env");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("Desplegando contrato con la cuenta:", deployer.address);

  // SistemaCredencialesUNQ requiere la address del 'rector' en su constructor.
  const rectorAddress = deployer.address;
  console.log("Asignando el rol de Rector a:", rectorAddress);

  const artifactJson = await fs.readFile("./artifacts_new/contracts/SistemaCredencialesUNQ.sol/SistemaCredencialesUNQ.json", "utf-8");
  const artifact = JSON.parse(artifactJson);

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const contract = await factory.deploy(rectorAddress);
  
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("✅ Contrato SistemaCredencialesUNQ desplegado en:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
