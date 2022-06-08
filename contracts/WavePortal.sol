// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
contract WavePortal{
    constructor(){
        console.log("Hey, its a smart contract!");
    }
    uint wave;
    function waveToUs() public {
        wave+=1;
        console.log("%s just waved!", msg.sender);
    }
    function totalWaves() public view returns(uint){ 
        console.log("%d is total no of waves!", wave);
        return wave;
    }
}