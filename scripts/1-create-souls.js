const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/SBTContract.sol/SBTContract.json");

// Provider
const provider = new ethers.providers.AlchemyProvider(network="maticmum", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract
const SBTContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    try {
        await SBTContract.createSoul('PROGRAD', 'https://prograd.ufsc.br');
        await SBTContract.createSoul('PROPG', 'https://propg.ufsc.br/');
        await SBTContract.createSoul('PROEX', 'www.proex.ufsc.br');

        const message = await SBTContract.listSouls();

        console.log(message)
    } catch (error) {
        console.log(error)
    }

}

main();
