# Wave Hand Project
**Backend is the root repo**

**Frontend code is in `react-frontend-wave-portal`**

In our last [repo](https://github.com/dakshp07/building-with-buildspace) we created a wave contract which increments the wave and returns the total no of waves. We also compiled, tested it using the script.js files and then used the node commands to deploy it on a local blockchain.

Now we will be going a step further and create a frontend to deploy it for the users who can use the web interface to talk to outr smart contract but in order to talk to it we have to first deploy the contract on a testnet. Here we will be using Rinkeby Testnet. We can also use Ropsten or any other testnet.

**Hold on:** Before deploying on testnet we have to first create a basic react appliction and set up metamask
react basic app can be found [here](https://github.com/buildspace/waveportal-starter-project?utm_source=buildspace.so&utm_medium=buildspace_project)
metamask setup can be found [here](https://metamask.io/download.html?utm_source=buildspace.so&utm_medium=buildspace_project)

# Deploy on Rinkeby Testnet
Go ahead and close the terminal with your local blockchain network running which is where you ran npx hardhat node. We won't need it anymore ;). I mainly just wanted to show you how deploying works locally.

Now we're going to be doing the real deal, deploying to the actual blockchain.

Go ahead and make an account with Alchemy [here](https://alchemy.com/?r=b93d1f12b8828a57?utm_source=buildspace.so&utm_medium=buildspace_project).

Next up is to get some test eth through faucet. Checkout the links for faucet [MyCrypto](https://app.mycrypto.com/faucet?utm_source=buildspace.so&utm_medium=buildspace_project), [Official Rinkeby](https://faucet.rinkeby.io/?utm_source=buildspace.so&utm_medium=buildspace_project), [Chainlink](https://faucets.chain.link/rinkeby?utm_source=buildspace.so&utm_medium=buildspace_project). 

Now next we have to edit the `hardhat.config.js` file by doing this
```js
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"]
    },
  },
};
```
here, `"YOUR_ALCHEMY_API_URL"` is the url that you get from "View Key" option in Alchemy Dashboard
and `"YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"` is the metmask private key which can be done by doing this:

`Accessing your private key can be done by opening MetaMask, change the network to "Rinkeby Test Network" and then click the three dots and select "Account Details" > "Export Private Key"`

Run this command from the root directory of project. Notice all we do is change it from localhost to rinkeby.

```shell
npx hardhat run scripts/deploy.js --network rinkeby
```
**Here's a sample output:**
```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

You can use the address to visit your contract on etherscan. Here's my contract on etherescan: https://rinkeby.etherscan.io/address/0x0225CE65718f5AB3228667c827634380C2CBE024


# Using React to draw the frontend
`react-frontend-wave-portal` conists of all the frontend code and files
we will make changes in the `react-frontend-wave-portal/src/app.js` to make our frontend talk with the contract that we deployed.

I have added all the comments which help us understand the code of react files.

# Final Output:
<img src="https://i.imgur.com/koMUwKD.png">

The right panel shows the wavescnt, the txid and how the wave count is increasing with every wave.