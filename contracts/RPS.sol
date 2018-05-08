pragma solidity ^0.4.22;

contract RPS {
  address public playerOne;
  address public playerTwo;
  bool public secured;
  bool private gameStarted;
  mapping (string => uint8) private moveToIndex;
  mapping (address => uint8) private playedMoves;
  mapping (address => bytes32) private encryptedPlayedMoves;

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

  function enableSecured() external onlyPlayerOne {
    require(!gameStarted);
    secured = true;
  }

  function invitePlayerTwo(address _playerTwo) external onlyPlayerOne {
    playerTwo = _playerTwo;
  }

  function play(string move) external onlyPlayers {
    require(!secured);
    uint8 index = moveToIndex[move];
    require(index > 0, 'Move was not found');
    require(playedMoves[msg.sender] == 0, 'A move was already played by the player');
    playedMoves[msg.sender] = index;
    gameStarted = true;
  }

  // Returns 0 if draw, 1 if playerOne wins, or 2 if playerTwo wins
  function getWinner() external onlyPlayers returns (uint8) {
    uint8 movePlayerOne = playedMoves[playerOne];
    uint8 movePlayerTwo = playedMoves[playerTwo];
    require(movePlayerOne > 0 && movePlayerTwo > 0);
    return (3 + movePlayerOne - movePlayerTwo) % 3;
  }

  function playSecured(bytes32 encryptedMove) external onlyPlayers {
    require(secured);
    encryptedPlayedMoves[msg.sender] = encryptedMove;
    gameStarted = true;
  }

  function submitSecret(string secret, string move) external onlyPlayers {
    require(secured);
    bytes32 encryptedMove = encryptedPlayedMoves[msg.sender];
    require(keccak256(strConcat(secret, move)) == encryptedMove, 'secret need to match the encryptedMove sent earlier');
    uint8 index = moveToIndex[move];
    require(index > 0, 'Move was not found');
    require(playedMoves[msg.sender] == 0, 'A move was already played by the player');
    playedMoves[msg.sender] = index;
  }

  // From https://ethereum.stackexchange.com/questions/729/how-to-concatenate-strings-in-solidity#1203
  function strConcat(string _a, string _b) internal returns (string) {
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    string memory ab = new string(_ba.length + _bb.length);
    bytes memory bab = bytes(ab);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
    return string(bab);
  }
}
