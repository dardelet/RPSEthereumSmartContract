const RPS = artifacts.require("./RPS.sol");

contract('RPS', accounts => {

  // Create shared variables accros tests.
  // Mainly used to avoid deploying the contract everytime
  let rps, creator, guest;
  it('should set shared variable', async () => {
    creator = accounts[0];
    guest = accounts[1];
    rps = await RPS.deployed({from: creator});
  })

  it('inviteGuest should set the guest variable in the state', async () => {
    await rps.inviteGuest(guest, {from: creator});
    assert((await rps.guest.call()) === guest, 'Guest address not set');
  });

  it('play method should store moves of the players', async () => {

    /*rps.play('InvalidMove', {from: creator}).then(() => assert(false))

    it('player should not be able to play an invalid move', async () => {
      console.log('lol');
    });*/
    //Lookup Error: VM Exception while processing transaction: revert

    it('player should be able to play only one move', async () => {
      await rps.play('Rock', {from: creator});
      try {
        await rps.play('Rock', {from: creator});
        assert(false);
      } catch(e) {}
    });

    it('only players should be able to play a move', async () => {
      await rps.play('Paper', {from: guest});
      try {
        await rps.play('Paper', {from: accounts[3]});
        assert(false);
      }
      catch (e) {console.log(e)}
    });
  });

  /*
  it('lol', async () => {
    await rps.play('Rock', {from: creator});
    await rps.play('Paper', {from: guest});
    console.log(await rps.getWinner.call());
  })*/
});

