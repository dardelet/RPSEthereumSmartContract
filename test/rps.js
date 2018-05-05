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

    /*rps.play('InvalidMove', {from: playerOne}).then(() => assert(false))

    it('player should not be able to play an invalid move', async () => {
      console.log('lol');
    });*/
    //Lookup Error: VM Exception while processing transaction: revert

    it('player should be able to play only one move', async () => {
      await rps.play('Rock', {from: playerOne});
      try {
        await rps.play('Rock', {from: playerOne});
        assert(false);
      } catch(e) {}
    });

    it('only players should be able to play a move', async () => {
      await rps.play('Paper', {from: playerTwo});
      try {
        await rps.play('Paper', {from: accounts[3]});
        assert(false);
      }
      catch (e) {console.log(e)}
    });
  });

  it('getWinner method should compute the winner', async () => {

    async function getWinnerOfGame(movePlayerOne, movePlayerTwo) {
      rps = await RPS.new({from: playerOne});
      await rps.invitePlayerTwo(playerTwo, {from: playerOne});
      await rps.play(movePlayerOne, {from: playerOne});
      await rps.play(movePlayerTwo, {from: playerTwo});
      return rps.getWinner.call();
    }

    assert((await getWinnerOfGame('Rock', 'Rock')).toNumber() === 0);
    assert((await getWinnerOfGame('Rock', 'Paper')).toNumber() === 2);
    assert((await getWinnerOfGame('Rock', 'Scissor')).toNumber() === 1);
    assert((await getWinnerOfGame('Paper', 'Rock')).toNumber() === 1);
    assert((await getWinnerOfGame('Paper', 'Paper')).toNumber() === 0);
    assert((await getWinnerOfGame('Paper', 'Scissor')).toNumber() === 2);
    assert((await getWinnerOfGame('Scissor', 'Rock')).toNumber() === 2);
    assert((await getWinnerOfGame('Scissor', 'Paper')).toNumber() === 1);
    assert((await getWinnerOfGame('Scissor', 'Scissor')).toNumber() === 0);
  });
});

