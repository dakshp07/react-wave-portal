# Wave Hand Project
**Backend is the root repo**

**Frontend code is in `react-frontend-wave-portal`**

In the [master](https://github.com/dakshp07/react-wave-portal/tree/master) branch we worked on normal frontend web app where you can click on button to increment wave value by one but now we are allowing the users to send a new message with their wave and also displaying them in the frontend.

We will be making some changes in the contract and deploying it again on Rinkeby Testnet.

# Changes in contract
Storing messages in arrays using structs. We will be also using events and emit to display the user with all the changes.

# Test the updated contract
Whenever we change our contract, we want to change run.js to test the new functionality we added. That's how we know it's working how we want!
**Output:**
<img src="https://i.imgur.com/djGAfbN.png">


# Re-Deploy on Rinkeby Testnet
So, now that we've updated our contract we need to do a few things:

1. We need to deploy it again.

2. We need to update the contract address on our frontend.

3. We need to update the abi file on our frontend. 

People constantly forget to do these 3 steps when they change their contract. Don't forget lol.

Why do we need to do all this? Well, it's because smart contracts are immutable. They can't change. They're permanent. That means changing a contract requires a full redeploy. This will also reset all the variables since it'd be treated as a brand new contract. That means we'd lose all our wave data if we wanted to update the contract's code.

So what you'll need to do now is:

1. Deploy again using `npx hardhat run scripts/deploy.js --network rinkeby`

2. Change `contractAddress` in `App.js` to be the new contract address we got from the step above in the terminal just like we did before the first time we deployed.

3. Get the updated abi file from `artifacts` like we did before and copy-paste it into Replit just like we did before.

You can use the address to visit your contract on etherscan. Here's my updated contract on etherescan: https://rinkeby.etherscan.io/address/0xD9DcfA337fc9D8Ea616a1b0770d74Ba1Da7CE6C5


# Using React to draw the frontend
`react-frontend-wave-portal` conists of all the frontend code and files
we will make changes in the `react-frontend-wave-portal/src/app.js` to make our frontend talk with the contract that we deployed.

I have added all the comments which help us understand the code of react files.

# Final Output:
I write the message `hey there` and wave to the user, now on the left panel it increments the count and asks me to pay the gas fees
<img src="https://i.imgur.com/k41RTv3.png">

Once the transaction is complete it gets added to the data that we are displaying on the frontend.
<img src="https://i.imgur.com/ZlYJUcR.png">