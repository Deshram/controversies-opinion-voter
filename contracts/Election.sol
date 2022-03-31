// SPDX-License-Identifier: MIT
pragma solidity ^0.4.2;

contract Election {

    //mapping to track propaganda => option => votes
    mapping (uint => mapping(uint => uint)) public propaganda;
    uint public propagandaCount;

    //mapping to track address => propaganda => voted/not_voted
    mapping (address => mapping(uint => bool)) public voters;
    
    // address owner;
    function Election() public {
        // adding default propagandas 
        addPropaganda(2);    //CAA
        addPropaganda(2);    // Farm bills
        addPropaganda(2);    // kashmir files
    }
    
    // modifier onlyOwner {
    //     require(msg.sender == owner);
    //     _;
    // }

    function addPropaganda(uint _numOption) private {
        propagandaCount++;
        for (uint option=1; option <= _numOption; option++) {
            //initializing votecount for each option of propaganda
            propaganda[propagandaCount][option] = 0;
        }
    }

    function vote (uint _propagandaId, uint _option) public {
        // require that they haven't voted before
        require(!ifVoted(msg.sender, _propagandaId));

        // record that voter has voted
        voters[msg.sender][_propagandaId] = true;

        // update candidate vote Count
        propaganda[_propagandaId][_option] ++;
    } 

    function ifVoted(address _voterAddress, uint _propagandaId) public view returns(bool) {
        return voters[_voterAddress][_propagandaId];
    }

    function seeVotes(uint _propagandaId, uint _option) public view returns(uint) {
        return propaganda[_propagandaId][_option];
    }
}