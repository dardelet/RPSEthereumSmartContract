pragma solidity ^0.4.22;

contract RPS {
  address public playerOne; // Player One
  address public playerTwo; // Player Two
  mapping (string => uint8) private moveToIndex;
  mapping (address => uint8) private playedMoves;

  modifier onlyPlayerOne() {
    require(msg.sender == playerOne);
    _;
  }

  modifier onlyPlayers() {
    require(msg.sender == playerOne || msg.sender == playerTwo);
    _;
  }

  constructor() public {
    playerOne = msg.sender;
    moveToIndex['Rock'] = 1;
    moveToIndex['Paper'] = 2;
    moveToIndex['Scissor'] = 3;
  }

  function invitePlayerTwo(address _playerTwo) external onlyPlayerOne {
    playerTwo = _playerTwo;
  }

  function play(string move) external onlyPlayers {
    uint8 index = moveToIndex[move];
    require(index > 0, 'Move was not found');
    require(playedMoves[msg.sender] == 0, 'A move was already played by the player');
    playedMoves[msg.sender] = index;
  }


  /*function getWinner() external onlyPlayers returns (uint8) {
    uint8 movePlayerOne = playedMoves[playerOne];
    uint8 movePlayerTwo = playedMoves[playerTwo];
    require(moveplayerOne > 0 && playedMoves[playerTwo] > 0);
  }*/
}
