const API_KEY = process.env.API_KEY;
const OPERATOR_1_PRIVATE_KEY = process.env.OPERATOR_1_PRIVATE_KEY;
const OPERATOR_2_PRIVATE_KEY = process.env.OPERATOR_2_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/UFSCSBT.sol/UFSCSBT.json");

// Provider
const provider = new ethers.providers.AlchemyProvider(network="maticmum", API_KEY);

// Signer
const signer1 = new ethers.Wallet(OPERATOR_1_PRIVATE_KEY, provider);
const signer2 = new ethers.Wallet(OPERATOR_2_PRIVATE_KEY, provider);

// Contract
const SBTContract1 = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer1);
const SBTContract2 = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer2);

async function main() {
    try {
        await SBTContract1.mint("4b39c81c-4a1d-4b24-a9d1-574cd05a0f89" ,"INE0001", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract2.mint("6ac3b24d-58ea-4ff2-91f7-aa5ece006302" ,"INE0002", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");

        await SBTContract1.mint("8f675c32-2ca5-401a-b9f5-77a60498bc82" ,"INE0002", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract1.mint("0e824011-ed1a-4a5a-a83a-e17aa699944b" ,"INE0003", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract1.mint("17d88032-9cc7-461e-acfa-906cb54fdb4c" ,"INE0004", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract1.mint("370c6e13-dd2c-4e77-91ca-47d3eea4057d" ,"INE0005", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract1.mint("39c76100-182e-4a02-8aa4-ecf3bca04266" ,"INE0006", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract1.mint("49d502ff-c7a4-430b-9448-8cf007ef559e" ,"INE0007", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");

        await SBTContract2.mint("e8297bba-199f-4057-b5b4-e8124936e1c6" ,"INE0008", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract2.mint("9825a571-13fb-4166-8390-2fc9a9724e57" ,"INE0009", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract2.mint("210c278b-fe54-4381-be5e-79b0b53ece7a" ,"INE0010", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
        await SBTContract2.mint("9624ef95-ac50-4737-a7a1-105afaa67d8d" ,"INE0011", "0x3A2d2Ee02844065908cD6708a86A105F42D7e4f2");
    } catch (error) {
        console.log(error)
    }
}

main();
