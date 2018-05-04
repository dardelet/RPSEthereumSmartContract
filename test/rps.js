const RPS = artifacts.require("./RPS.sol");

// Create a run context to share variable accros tests.
// Mainly used to avoid deploying a new contract everytime
const run = async(accounts) => {
  const creator = accounts[0];
  const guest = accounts[1];
  const rps = await RPS.deployed({from: creator});
  return { rps, creator, guest }
};

contract('RPS', accounts => {

  let rps, creator, guest;
  it('should set shared variable from context', async () => {
    const context = await run(accounts);
    rps = context.rps;
    creator = context.creator;
    guest = context.guest;
  })

  it('inviteGuest should set the guest variable in the state', async () => {
    await rps.inviteGuest(guest, {from: creator});
    assert((await rps.guest.call()) === guest, 'Guest address not set');
  });

  /*it('play should set the guest variable in the state', async () => {
    await rps.inviteGuest(guest, {from: creator});
    assert((await rps.guest.call()) === guest, 'Guest address not set');
  });*/
});

