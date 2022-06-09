// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";
contract WavePortal{
    uint prizeAmt=0.01 ether;
    uint256 seed; // randomness variable
    event NewWave(address indexed from, uint256 timestamp, string message);
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }
    Wave[] waves;
    // now there are chances that people might just wave again and again to win the prize
    // so we need a cooldown perios to stop them from doing that
    // we can do that by keeping a track of one who waved
    mapping(address=>uint256) justWaved;

    constructor() payable {
        console.log("Hey, its a smart contract!");
        seed=(block.timestamp+block.difficulty)%100; // intial value of seed, %100 brings the value to lie between 0-99
    }
    uint twave;
    function wave(string memory _message) public {
        // We need to make sure the current timestamp for the user waving is at least 15-minutes bigger than the last timestamp we stored when they waved last
        require(justWaved[msg.sender]+15 minutes<block.timestamp, "wait for 15 mins");
        twave+=1;
        console.log("%s just waved with message %s!", msg.sender, _message);
        waves.push(Wave({waver: msg.sender, message: _message, timestamp: block.timestamp}));
        seed=(block.timestamp+block.difficulty+seed)%100; // new seed for the ones who waves, its random beacuse block.timestamp & block.difficulty changes everytime
        console.log("Random # generated: %d", seed); // display that seed
        // given a 50% chance that a user wins
        if(seed<=50)
        {
            console.log("%s won!", msg.sender);
        }
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