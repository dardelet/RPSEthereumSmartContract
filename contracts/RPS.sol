pragma solidity ^0.4.22;

contract RPS {
  address public creator; // Player One
  address public guest; // Player Two
  mapping (string => uint8) private validMoves;
  mapping (address => string) private playedMoves;

  modifier onlyCreator() {
    require(msg.sender == creator);
    _;
  }

  /*modifier onlyCreatorOrGuest() {
    require(msg.sender == creator or msg.sender == guest);
    _;
  }*/

  constructor() public {
    creator = msg.sender;
    validMoves['R'] = 0;
    validMoves['P'] = 1;
    validMoves['S'] = 2;
  }

  function inviteGuest(address _guest) external onlyCreator {
    guest = _guest;
  }

  function play(string move) external returns (uint) {//onlyCreatorOrGuest {
    uint validMove = validMoves[move];
    return validMove;
    //playedMoves[msg.sender] = 
  }

  function getWinner() public {
  }
}
