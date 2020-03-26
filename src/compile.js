import fs from 'fs'
import path from 'path'
import solc from 'solc'

// import linker from 'solc/linker'
// const bytecode = linker.linkBytecode(bytecode, { MyLibrary: '0x123456...' });

export default () => {

    const contractPath = (name) => path.join('contracts', name)
    const loadContract = (name) => fs.readFileSync(contractPath(name), 'utf8')
    const loadContracts = (...names) => names.reduce((prev, name) => {
        const add = {}
        add[name] = {content: loadContract(name)}
        return Object.assign(prev, add)
    }, {})

    const input = {
        language: 'Solidity',
        sources: loadContracts('goszakupki.sol'),
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    const output = JSON.parse(solc.compile(JSON.stringify(input)))
    // console.log('output', output)

    for (let sourceFileName in output.contracts) {
        const sourceFile = output.contracts[sourceFileName]
        for (let contractName in sourceFile) {
            const contract = sourceFile[contractName]

            const bytecode = contract.evm.bytecode.object
            const abi = contract.abi

            console.log(String.fromCharCode(0x2022).repeat(64))
            // console.log('contract', sourceFileName, '=>', contractName)

            if (contractName === "goszakupki") {

                // console.log('gas', contract.evm.gasEstimates.creation, contract.evm.gasEstimates.external)
                // console.log(bytecode.length, abi)

                return {bytecode, abi}
            }
        }
    }

}
