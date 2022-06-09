// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
contract WavePortal{
    uint prizeAmt=0.01 ether;
    event NewWave(address indexed from, uint256 timestamp, string message);
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }
    Wave[] waves;
    constructor() payable {
        console.log("Hey, its a smart contract!");
    }
    uint twave;
    function wave(string memory _message) public {
        twave+=1;
        console.log("%s just waved with message %s!", msg.sender, _message);
        waves.push(Wave({waver: msg.sender, message: _message, timestamp: block.timestamp}));
        emit NewWave(msg.sender, block.timestamp, _message);
        require(prizeAmt<=address(this).balance, "trying to withdraw more than the contract has");
        (bool success, ) = (msg.sender).call{value: prizeAmt}("");
        require(success, "failed transaction");
    }
    function totalWaves() public view returns(uint){ 
        console.log("%d is total no of waves!", twave);
        return twave;
    }
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}