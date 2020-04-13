# smartcontract-experiments

# How to run?

* install latest `docker`
* install latest `docker-compose`
* invoke `./compose-up` in shell from repository root

# Development cycle

1. Develop contract
2. Cover new features with assertions
3. Invoke `./compose-up` to run testsuite

## Docs

* Solidity
  * [costs-of-a-real-world-ethereum-contract](https://hackernoon.com/costs-of-a-real-world-ethereum-contract-2033511b3214)
  * [smart-contract-best-practices](https://github.com/ConsenSys/smart-contract-best-practices)
  * [function-modifiers](https://solidity.readthedocs.io/en/develop/contracts.html#function-modifiers)
  * [structure-of-a-contract](https://solidity.readthedocs.io/en/v0.6.4/structure-of-a-contract.html)

### Gas

[ethereum-gas-explained-in-plain-english](https://medium.com/coinmonks/ethereum-gas-explained-in-plain-english-d9e60a699c54)

* Gas estimation?
  * For blobs?

### Notes

* web3.js - Ethereum JavaScript API
  * [docs](https://web3js.readthedocs.io)
  * [source](https://github.com/ethereum/web3.js/)
  * examples
    * [call contract methods](https://bitsofco.de/calling-smart-contract-functions-using-web3-js-call-vs-send/)
* go-ethereum - Official Go implementation of the Ethereum protocol
  * [source](https://github.com/ethereum/go-ethereum)
  * [golang <-> contract binding](https://geth.ethereum.org/docs/dapp/native-bindings)
  * [automated testing](https://geth.ethereum.org/docs/dapp/native-bindings#blockchain-simulator)
* ethers.js
  * [docs](https://docs.ethers.io/ethers.js/html/)
  * [source](https://github.com/ethers-io/ethers.js/)
    * examples
      * [basic - wallets/contracts](https://kauri.io/accelerating-dapp-development-with-ethersjs/805715d4e66440d996fee0930a6d0fbc/a)

### Misc

**Ethereum Developer Resources**
https://ethereum.org/developers/#getting-started

**EIP20**
https://eips.ethereum.org/EIPS/eip-20

**If you want to create a standards-compliant token, see:**
https://github.com/ConsenSys/Tokens

**VueJS dApp**
https://medium.com/openberry/ethereum-solidity-vue-js-tutorial-simple-auction-dapp-within-10-minutes-76ba48156b2

**Subspace dApps framework**
https://subspace.embarklabs.io/#learn

**dApps informational website**
https://www.stateofthedapps.com/

**swarm-gateways.net**
https://swarm-gateways.net/

https://docs.ethers.io/ethers.js/html/cookbook-providers.html#testrpc-ganache

https://medium.com/upstate-interactive/mappings-arrays-87afc697e64f

**SafeMath**
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

**Basic dApps browser integration**
```javascript
window.addEventListener('load', async () => {
  	if (window.ethereum) { // Modern dapp browsers...
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            accountaddress = web3.givenProvider.selectedAddress;
            ballotContract = new web3.eth.Contract(abi);        		    
        } catch (error) {
            // User denied account access...
        }
    } else if (window.web3) { // Legacy dapp browsers...
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
    } else { // Non-dapp browsers...
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});
```
