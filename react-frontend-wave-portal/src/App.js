import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/WavePortal.json"; // the json file from artifacts/contracts/WavePortal.sol/WavePortal.json

const App=()=>{
  const contractAdd="0x0225CE65718f5AB3228667c827634380C2CBE024"; // the deployed contract address
  const contractABI=abi.abi; // using json file as an abi
  const [currAcc, setCurrAcc]=useState(""); // setting curr acc if not present from before or accessing the already existing acc
  const checkIfWalletIsConnected=async()=>{
    try{
      const {ethereum}=window; // check if metamask is there or not
      if(!ethereum){
        console.log("Make sure you have metamask!");
      }
      else {
        console.log("We have the ethereum object", ethereum);
      }
      const acc=await ethereum.request({method: "eth_accounts"}); // get the list of accounts in metamask
      if(acc.length!==0) {
        const accs=acc[0]; // choose first one
        console.log("Found an authorized account:", accs);
        setCurrAcc(accs); // set curr acc to that one
      }
      else {
        console.log("No authorized account found")
      }
  }
  catch (error) {
    console.log(error);
  }
}
  const connectWallet=async()=>{ // function that uses a button to connect the wallet
    try{
      const{ethereum}=window;
    
      if(!ethereum)
      {
        alert("Get MetaMask!");
        return;
      }
      const accs=await ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected", accs[0]);
    }
    catch(error){
      console.log(error);
    }
  }

  const wave=async()=>{ // function that will talk with our contract ie increment the wave and read the value of wave
    try{
      const{ethereum}=window;
      if(ethereum)
      {
        const provider=new ethers.providers.Web3Provider(ethereum);
        const signer=provider.getSigner();
        const waveContract=new ethers.Contract(contractAdd, contractABI, signer); // using contract address, abi, signer of contract here

        let cnt=await waveContract.totalWaves(); // retrieve no of waves using the totalWaves() function of our contract
        console.log("retrieved total cnt: ", cnt.toNumber());

        const waveTxn=await waveContract.waveToUs(); // increment +1 to the no of waves using the waveToUs() function of our contract
        
        // When we run this, you'll see that total wave count is increased by 1. You'll also see that Metamask pops us and asks us to pay "gas" which we pay for using our fake $.
        console.log("Mining...", waveTxn.hash); // displaying the transaction id

        await waveTxn.wait(); // waiting for the transaction to finish
        console.log("Mined -- ", waveTxn.hash); // displaying the transaction id

        cnt=await waveContract.totalWaves(); // again retrieve no of waves using the totalWaves() function of our contract
        console.log("retrieved total cnt: ", cnt.toNumber());
      }
      else
      {
        console.log("Ethereum object doesn't exist!");
      }
    }
    catch (error) {
      console.log(error);
    }
  }


  useEffect(()=>{
    checkIfWalletIsConnected();
  }, [])

  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am daksh and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}> {/* calling the wave function to increment and display the wave count*/}
          Wave at Me
        </button>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currAcc && (
          <button className="waveButton" onClick={connectWallet}> {/* calling the connectWallet() function to connect the wallet if not already connected*/}
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
export default App