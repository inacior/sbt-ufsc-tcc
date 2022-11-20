const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/UFSCSBT.sol/UFSCSBT.json");

// Provider
const provider = new ethers.providers.AlchemyProvider(network="maticmum", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract
const SBTContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    try {
        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0001");
        await SBTContract.enableOperator("0xB4ab92133e4b5869453253B690174Cd85075d9bb" ,"INE0002");

        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0002");
        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0003");
        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0004");
        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0005");
        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0006");
        await SBTContract.enableOperator("0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294" ,"INE0007");

        await SBTContract.enableOperator("0xB4ab92133e4b5869453253B690174Cd85075d9bb" ,"INE0008");
        await SBTContract.enableOperator("0xB4ab92133e4b5869453253B690174Cd85075d9bb" ,"INE0009");
        await SBTContract.enableOperator("0xB4ab92133e4b5869453253B690174Cd85075d9bb" ,"INE0010");
        await SBTContract.enableOperator("0xB4ab92133e4b5869453253B690174Cd85075d9bb" ,"INE0011");
    } catch (error) {
        console.log(error)
    }
}

main();
