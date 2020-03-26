import * as ethers from 'ethers'
import compileContract from './compile'
import * as utils from "ethers/utils";
import {OK, FAIL} from "./assert"

process.on('uncaughtException', function (error) {
    console.error(error)
});

const banner = (text) => {
    console.log(String.fromCharCode(0x2022).repeat(64))
    console.log(String.fromCharCode(0x2022).repeat(4), text)
    console.log(String.fromCharCode(0x2022).repeat(64))

}

const provider = new ethers.providers.JsonRpcProvider(
    process.env.DOCKER === 'true' ? 'http://ganache:8545' : 'http://localhost:8545'
);

(async function () {
    console.log('gasPrice', (await provider.getGasPrice()).toString());

    //> Alice is the boss
    const aliceWallet = provider.getSigner(0)
    const bobWallet = provider.getSigner(1)
    const eveWallet = provider.getSigner(2)

    console.log('Alice wallet', await aliceWallet.getAddress());
    console.log('Bob wallet', await bobWallet.getAddress());
    console.log('Eve wallet', await eveWallet.getAddress());

    const {
        contractAddress,
        contractABI
    } = await (async () => {
        const {abi, bytecode} = compileContract()

        // let factory = ethers.ContractFactory.fromSolidity(compiled, walletAlice);
        const factory = new ethers.ContractFactory(abi, bytecode, aliceWallet)
        // console.log('factory', factory.interface)

        const contract = await factory.deploy() //> Constructor args here

        console.log('contract address', contract.address)
        console.log('deployment transaction address', contract.deployTransaction.hash)

        await contract.deployed()
        console.log('contract actually deployed')

        return {
            contractAddress: contract.address,
            contractABI: contract.interface.abi
        }
    })();

    let aliceContract = new ethers.Contract(contractAddress, contractABI, aliceWallet)
    let bobContract = new ethers.Contract(contractAddress, contractABI, bobWallet)
    let eveContract = new ethers.Contract(contractAddress, contractABI, eveWallet)

    banner('STARTING TEST')

    await OK('Alice checks who is the owner', async () => {
        return (await aliceContract.functions.owner() === await aliceWallet.getAddress())
    })

    await OK('Bob checks who is the owner', async () => {
        return (await bobContract.functions.owner() === await aliceWallet.getAddress())
    })

    await FAIL('Eve tries to hijack contract', async () => {
        return await eveContract.functions.changeOwner(await eveWallet.getAddress())
    }, 'only owner can do this')

    await OK('Alice transfers ownership to Bob', async () => {
        return await aliceContract.functions.changeOwner(await bobWallet.getAddress())
    })

    await FAIL('Eve gonna accept ownership', async () => {
        return await eveContract.functions.confirmMeAsCandidate()
    }, 'only active candidate')

    await OK('Bob going to confirm himself as new owner', async () => {
        return await bobContract.functions.confirmMeAsCandidate()
    })

    await OK('Alice finally confirms Bob as new owner:', async () => {
        return await aliceContract.functions.confirmOwner(await bobWallet.getAddress())
    })

    await OK('Alice no more an owner', async () => {
        return (await aliceContract.functions.owner() !== await aliceWallet.getAddress())
    })

    await OK('but Bob is the new owner now', async () => {
        return (await bobContract.functions.owner() === await bobWallet.getAddress())
    })

    banner('TEST PASSED')
})();



// const ganache = Ganache.provider({});
// const provider = new ethers.providers.Web3Provider(ganache);

// import ganache from 'ganache-core'
// const server = ganache.server();
// const provider = server.provider;
// server.listen(port, 'localhost');


