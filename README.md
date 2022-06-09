# Wave Hand Project
**Backend is the root repo**

**Frontend code is in `react-frontend-wave-portal`**

In the [payable-contract](https://github.com/dakshp07/react-wave-portal/tree/payable-contract) branch we worked worked on making the contract payable and give ETH on every wave.

Now we will be making some changes in the contract and deploying it again on Rinkeby Testnet but this time we will allow it to make randomly pick a number and send some ETH to that waver and we also implemente the cool down in order to make sure that there is no fraudalent activity in the network and in the smart contract that could possibly allow someone get the ETH everytime.

# Changes in contract
So right now, our code is set to give the waver 0.0001 ETH every single time! Our contract will run out of money pretty fast, and then the fun is over and we'd need to add more funds to our contract. In this lesson, I'll walk you through how to:

1. Randomly pick a winner.

2. Create a cooldown mechanism to prevent people from spam-waving you in an attempt to win the prize or annoy you. 

Lets's do the random winner first!

So, generating a random number in smart contracts is widely known as a difficult problem.

Why? Well, think about how a random number is generated normally. When you generate a random number normally in a program, it will take a bunch of different numbers from your computer as a source of randomness like: the speed of the fans, the temperature of the CPU, the number of times you've pressed "L" at 3:52PM since you've bought the computer, your internet speed, and tons of other #s that are difficult for you to control. It takes all these numbers that are "random" and puts them together into an algorithm that generates a number that it feels is the best attempt at a truly "random" number. Make sense?

On the blockchain, there is nearly no source of randomness. Everything the contract sees, the public sees. Because of that, someone could game the system by just looking at the smart contract, seeing what #s it relies on for randomness, and then the person could give it the exact numbers they need to win.

**Check the comments in code of contract to see how we implemeted the randomness.**

# Cooldowns to prevent spammers
Awesome. You have a way to randomly send ETH to people now! Now, it might be useful to add a cooldown function to your site so people can't just spam wave at you. Why? Well, maybe you just don't want them to keep on trying to win the prize over and over by waving at you. Or, maybe you don't want just their messages filling up your wall of messages.

Check out the code. I added comments where I added new lines.

**Check the comments in code of contract to see how we implemeted the randomness.**

# Test the updated contract
Whenever we change our contract, we want to change run.js to test the new functionality we added. That's how we know it's working how we want!
**Output:**
<img src="https://i.imgur.com/ItwxUd1.png">


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

You can use the address to visit your contract on etherscan. Here's my updated contract on etherescan: https://rinkeby.etherscan.io/address/0x8d749596922f66d63348C8cec707e076723A4864

# Setting gas limit
When you try to "wave" now, you may notice you sometimes get an error that looks something like "out of gas". Why?

Well, basically Metamask will try to estimate how much gas a transaction will use. But, sometimes it's wrong! In this case, it's made more difficult by the fact that we have some randomness involved. So, if the contract sends a prize then the waver needs to pay more gas since we're running **more** code.

Estimating gas is a hard problem and an easy workaround for this (so our users don't get angry when a transaction fails) is to set a limit.

On `App.js`, I changed the line that sends the wave to 

```js
wavePortalContract.wave(message, { gasLimit: 300000 })
```

What this does is make the user pay a set amount of gas of 300,000. And, if they don't use all of it in the transaction they'll automatically be refunded.

So, if a transaction costs 250,000 gas then after that transaction is finalized that 50,000 gas left over that the user didn't use will be refunded :).

# Refresh to see changes: ISSUE!
Lets say I'm chilling on your website and I just have it open. While I'm doing this, your other friend Jeremy waves to you. Right now, the only way I'd see Jeremy's wave is if I refreshed my page. This seems bad. Wouldn't it be cool if I could know that that contract was updated and have my UI magically update?

Even now, it's kinda annoying when we ourselves submit a message, and then we have to wait for it to be mined and then refresh the page to see all the updated list of messages, right? Lets fix that.

```js
/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
```

**Check comments in `App.js` to see how we implement things**
At the very bottom you'll see the magic bit of code I added :). Here, I can actually "listen" when my contract throws the NewWave event. Like a webhook :). Pretty dope, right?

I can also access that data on that event like message and from. Here, I do a setAllWaves when I get this event which means the user's message will automatically be appended to my allWaves array when we receive the event and our UI will update!

This is super powerful. It lets us create web apps that update in real-time :). Think about if you were making something like a Uber or Twitter on the blockchain, web apps that update in real-time become mega important.

I want you to hack around with this and build whatever you want :).

# Final Output:
I write the message `hey` and wave to the user, now on the left panel it increments the count and asks me to pay the gas fees **BUT** this time I **DO NOT REFRESH** and I can see the transaction details on our frontend.
<img src="https://i.imgur.com/BaFp471.png">