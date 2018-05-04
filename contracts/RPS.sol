pragma solidity ^0.4.22;

contract RPS {
  address public creator; // Player One
  address public guest; // Player Two
  mapping (string => uint8) private moveToIndex;
  mapping (address => uint8) private playedMoves;

  modifier onlyCreator() {
    require(msg.sender == creator);
    _;
  }

  modifier onlyCreatorOrGuest() {
    require(msg.sender == creator || msg.sender == guest);
    _;
  }

  constructor() public {
    creator = msg.sender;
    moveToIndex['Rock'] = 1;
    moveToIndex['Paper'] = 2;
    moveToIndex['Scissor'] = 3;
  }

  function inviteGuest(address _guest) external onlyCreator {
    guest = _guest;
  }

  function play(string move) external onlyCreatorOrGuest {
    uint8 index = moveToIndex[move];
    require(index > 0, 'Move was not found');
    require(playedMoves[msg.sender] == 0, 'A move was already played by the player');
    playedMoves[msg.sender] = index;
  }


  /*function getWinner() external onlyCreatorOrGuest returns (uint8) {
    uint8 moveCreator = playedMoves[creator];
    uint8 moveGuest = playedMoves[guest];
    require(moveCreator > 0 && playedMoves[guest] > 0);
  }*/
}
