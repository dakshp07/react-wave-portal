import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"; // the json file from artifacts/contracts/WavePortal.sol/WavePortal.json

export default function App() {
  const [currAccount, setCurrentAccount] = React.useState("");
  const contractAddress = "0x8d749596922f66d63348C8cec707e076723A4864"; // the deployed contract address
  const contractABI = abi.abi; // using json file as an abi
  const [currCount, setCurrCount] = React.useState(""); // setting curr count if not present from before or accessing the already existing count
  const[message, setMessage] = React.useState(""); // setting user message for the wave


  const checkIfWalletIsConnected = () => { // function to check if wallet is connected or not
    const { ethereum } = window;
    if (!ethereum) { // throw error if not installed
      console.log("Check if you have installed Metamask")
      return
      } else { // else display that its there
        console.log("We have the Ethereum object", ethereum)
      }
      ethereum.request({method: 'eth_accounts'})
      .then(accounts => {
        if (accounts.length!==0){
          const account = accounts[0]; // grab the first account
          console.log("Found an authorized account: ", account)
          setCurrentAccount(account);
          getAllWaves();
        } else {
          console.log("No authorized account found")
        }
      })
    }

const connectWallet = async () => { // connect wallet (only one time use)
  const { ethereum } = window;
  if (!ethereum) {
    alert("Get Metamask")
  }
  ethereum.request({method: 'eth_requestAccounts' })
  .then(accounts => {
    console.log("Connected", accounts[0])
    setCurrentAccount(accounts[0]) // set current account to first one
  })
  .catch(err => console.log(err));
  window.location.reload();
}

const wave = async () => { // function that will talk with our contract ie increment the wave and read the value of wave
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer); // using contract address, abi, signer of contract here

  let count = await waveportalContract.totalWaves()  // retrieve no of waves using the totalWaves() function of our contract
  console.log("Retrieved total waves", count.toNumber())

  // When you try to "wave" now, you may notice you sometimes get an error that looks something like "out of gas". Why?
  // Well, basically Metamask will try to estimate how much gas a transaction will use. But, sometimes it's wrong! In this case, it's made more difficult by the fact that we have some randomness involved. So, if the contract sends a prize then the waver needs to pay more gas since we're running more code.
  // Estimating gas is a hard problem and an easy workaround for this (so our users don't get angry when a transaction fails) is to set a limit.
  const waveTxn = await waveportalContract.wave(message, {gasLimit: 300000}) // increment +1 to the no of waves and also put the message using the wave() function of our contract
  
  // When we run this, you'll see that total wave count is increased by 1. You'll also see that Metamask pops us and asks us to pay "gas" which we pay for using our fake $.
  console.log("Mining...", waveTxn.hash)  // displaying the transaction id
  await waveTxn.wait() // waiting for the transaction to finish
  console.log("Mined -- ", waveTxn.hash) // displaying the transaction id

  count = await waveportalContract.totalWaves() // again retrieve no of waves using the totalWaves() function of our contract
  console.log("Retrieved total wave count...", count.toNumber())
  setCurrCount(count.toNumber())
  console.log(currCount)
}

const [allWaves, setAllWaves] = React.useState([]) // setting the value of allWaves to use in frontend and setAllWaves will consist of all information
async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.getAllWaves() // getting all the information in waves

    let wavesCleaned = [] // storing in clean manner in this array
    waves.forEach(wave => { // pushing the stuff
        wavesCleaned.push({
            address: wave.address,
            timestamp: new Date(wave.timestamp*1000),
            message: wave.message
        })
    })

    setAllWaves(wavesCleaned) // set the value of setAllWaves
}

React.useEffect(()=> {
  checkIfWalletIsConnected();
  let wavePortalContract;
  const onNewWave=(from, timestamp, message)=>{
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState=>[
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp*1000),
        message: message,
      },
    ]);
  };
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }
  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
  
return (
  <div className="mainContainer">

    <div className="dataContainer">
      <div className="header">
      👋 Hello there!
      </div>

      <div className="bio">
      daksh with {currCount} waves {/*displaying the current count of waves*/}
      </div>
      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>
      {currAccount ? null: (
        <button className="wavebutton" onClick={connectWallet}>Connect Wallet then refresh page to view count
        </button>
      )}
      <textarea value={message} onChange={(event) => setMessage(event.target.value)}/> {/*allowing the user to write custom message, store that message in message variable and pass to setMessage*/}

      {allWaves.map((wave, index)=> {
      return (
        <div style={{backgroundColour: "OldLace", marginTop: "16px", padding: "8px"}}> {/*displaying the information by accessing them as index one by one*/}
          <div>Address: {wave.address}</div>
          <div>Time: {wave.timestamp.toString()}</div>
          <div>Message: {wave.message}</div>
        </div>
      )
      })}
    </div>
  </div>
)
}