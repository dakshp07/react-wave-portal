const main=async()=>{
    const [deployer]=await hre.ethers.getSigners();
    const accBalance=await deployer.getBalance();
    
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accBalance.toString());

    const waveFac=await hre.ethers.getContractFactory("WavePortal"); // artifacts directory has contract, so calling it by name of contract
    const waveCon=await waveFac.deploy(); // deploying the contract
    await waveCon.deployed(); // wait till the contract is deployed

    console.log("contract deployed at:", waveCon.address); // display the address where it is deployed
};

const runmain=async()=>{
    try{
        await main();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
};
runmain();