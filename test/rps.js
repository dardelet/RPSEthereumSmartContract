const RPS = artifacts.require("./RPS.sol");

contract('RPS', accounts => {

  // Create shared variables accros tests.
  // Mainly used to avoid deploying the contract everytime
  let rps, playerOne, playerTwo;
  it('should set shared variable', async () => {
    playerOne = accounts[0];
    playerTwo = accounts[1];
    rps = await RPS.deployed({from: playerOne});
  })

  it('invitePlayerTwo should set the playerTwo variable in the state', async () => {
    await rps.invitePlayerTwo(playerTwo, {from: playerOne});
    assert((await rps.playerTwo.call()) === playerTwo, 'playerTwo address not set');
  });

  it('play method should store moves of the players', async () => {
    // Those lines below test that the following smart contract call
    // will fail with invalid parameters. If it does fail, the exception
    // will be caught and execution continues normally. If it does not
    // fail (as it should) the assert(false) will make the test itself fail
    try {
      await rps.play('InvalidMove', {from: playerOne});
      assert(false);
    } catch(e) {
      if (e.name == 'AssertionError')
        assert(false, 'player should be able to play only valid move');
    }

    await rps.play('Rock', {from: playerOne});
    try {
      await rps.play('Rock', {from: playerOne});
      assert(false);
    } catch(e) {
      if (e.name == 'AssertionError')
        assert(false, 'player should be able to play only one move');
    }

    try {
      await rps.play('Paper', {from: accounts[2]});
      assert(false);
    } catch(e) {
      if (e.name == 'AssertionError')
        assert(false, 'only registered players should be able to play a move');
    }
  });

  it('getWinner method should compute the winner', async () => {
    const DRAW = 0;
    const PLAYER1 = 1;
    const PLAYER2 = 2;

    async function getWinnerOfGame(movePlayerOne, movePlayerTwo) {
      rps = await RPS.new({from: playerOne});
      await rps.invitePlayerTwo(playerTwo, {from: playerOne});
      await rps.play(movePlayerOne, {from: playerOne});
      await rps.play(movePlayerTwo, {from: playerTwo});
      return rps.getWinner.call();
    }

    assert((await getWinnerOfGame('Rock', 'Rock')).toNumber() === DRAW);
    assert((await getWinnerOfGame('Rock', 'Paper')).toNumber() === PLAYER2);
    assert((await getWinnerOfGame('Rock', 'Scissor')).toNumber() === PLAYER1);
    assert((await getWinnerOfGame('Paper', 'Rock')).toNumber() === PLAYER1);
    assert((await getWinnerOfGame('Paper', 'Paper')).toNumber() === DRAW);
    assert((await getWinnerOfGame('Paper', 'Scissor')).toNumber() === PLAYER2);
    assert((await getWinnerOfGame('Scissor', 'Rock')).toNumber() === PLAYER2);
    assert((await getWinnerOfGame('Scissor', 'Paper')).toNumber() === PLAYER1);
    assert((await getWinnerOfGame('Scissor', 'Scissor')).toNumber() === DRAW);
  });
});

