# RPSEthereumSmartContract
A solidity smart contract to play Rock Paper Scissor on the Ethereum Blockchain

# How to play

Instantiate the contract and invite another player with `invitePlayerTwo`.

There exists two version of the game:

## Unsecure version:

Only players may call the `play` function to submit their move (either 'Rock', 'Paper' or 'Scissor').

Then they can call `getWinner` to see who won.

However since smart contract data is public, the player who plays first will always have a disavantage since the second player will be able to see their move.

## Secure version:

Players may create a secured game by calling `enableSecured`.

In order to play the secured version, players need to:
- Choose a random string
- Concatenate it with their move
- Hash it using the keccak256 hash function
- Send the encrypted move to `playSecured`

After the first player submits their move, the second player will not be able to see it, and can't guess it unless they know the secret random string of the first player.

After both player have submitted their encrypted move, they need to submit their secret with `submitSecret` so that the contract can reveal their moves, and get the winner with the `getWinner` function.
