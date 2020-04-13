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

    banner('TESTING OWNERSHIP TRANSFER')

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
        console.log('ESTIMATE')
        console.dir((await aliceContract.estimate.changeOwner(await bobWallet.getAddress())))
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


    banner('OWNERSHIP TRANSFER TEST PASSED')

    banner('STARTING BUSINESS LOGIC TEST')

    await OK('Should store byte array', async () => {
        // const b = ethers.utils.hexlify(new Uint8Array(1024))
        const b = Array.from(new Uint8Array(1))
        // const b = ethers.utils.arrayify(new Uint8Array(1024))
        // const b = ethers.utils.toUtf8Bytes('hello')
        // let b = "0xddd0a7290af9526056b4e35a077b9a11b513aa0028ec6c9880948544508f3c63" +
        //     "265e99e47ad31bb2cab9646c504576b3abc6939a1710afc08cbf3034d73214b8" +
        //     "1c"
        // console.log('ESTIMATE')
        // console.log((await aliceContract.estimate.putBytes(b)).toString())
        return await aliceContract.functions.putBytes(b)
    })

})();

// gas price:  2 gwei
// txn time:  20 min
//
// contract deployment => few usd
// base     => 21000   =>   0.43₽
// 0        => 23920   =>   0.49₽
// 1        => 43266   =>   0.89₽
// 10       => 43266   =>   0.89₽
// 1024     => 76616   =>   1.58₽
// 1024*2   => 108751  =>   2.25₽
// 1024*100 => 3277373 =>  67.81₽
// 1024*200 => 6548927 => 135.49₽

// async getGasPrice() {
//     const gasPrice = await super.getGasPrice()
//     return gasPrice.add(gasPrice.div(5))
// }

// const ganache = Ganache.provider({});
// const provider = new ethers.providers.Web3Provider(ganache);

// import ganache from 'ganache-core'
// const server = ganache.server();
// const provider = server.provider;
// server.listen(port, 'localhost');


