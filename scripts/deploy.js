async function main() {
    const Contract = await ethers.getContractFactory("SBTContract");

    // Start deployment, returning a promise that resolves to a contract object
    const contract_deployer = await Contract.deploy("Test SBT", "TESTSBT");
    console.log("Contract deployed to address:", contract_deployer.address);
 }

 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
