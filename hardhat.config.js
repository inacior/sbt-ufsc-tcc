/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY, API_URL_MAINNET } = process.env;

module.exports = {
   solidity: "0.8.13",
   defaultNetwork: "mumbai",
   networks: {
      hardhat: {
         allowUnlimitedContractSize: true,
      },
      mumbai: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`],
      },
      matic: {
         url: API_URL_MAINNET,
         accounts: [`0x${PRIVATE_KEY}`],
         allowUnlimitedContractSize: true,
      }
   },
}
