const main=async()=>{
    const [owner, randomPerson]=await hre.ethers.getSigners(); // owner address and some random guy address
    const waveFac=await hre.ethers.getContractFactory("WavePortal"); // artifacts directory has contract, so calling it by name of contract
    const waveCon=await waveFac.deploy(); // deploying the contract
    // note: hardhat always creates a new ethereum blockchain and destroys it once the script is complete and it does this for every contract
    // its good as its like refereshing the server which helps in debugging the errors fast
    await waveCon.deployed(); // wait till the contract is deployed
    console.log("contract deployed at:", waveCon.address); // display the address where it is deployed
    console.log("contract deployed by:", owner.address); // just displaying owners (me) address

    let waveCnt;
    waveCnt=await waveCon.totalWaves(); // calling the totalWaves() function from my contract

    // let waveTxn=await waveCon.waveToUs(); here i was waving to myself so i just changed that so that another radon can wave
    let waveTxn=await waveCon.connect(randomPerson).waveToUs(); // telling the random guy to wave to me through the waveToUs() function from my contract
    await waveTxn.wait();

    waveCnt=await waveCon.totalWaves();  // calling the totalWaves() function from my contract
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