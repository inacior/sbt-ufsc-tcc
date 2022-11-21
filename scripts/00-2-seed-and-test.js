const { v4 } = require('uuid')

const API_KEY = process.env.API_KEY_MAINNET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/UFSCSBT.sol/UFSCSBT.json");

// Provider
const provider = new ethers.providers.AlchemyProvider(network="matic", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract
const SBTContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    // CSV options
    // const tokens = ["INE0001", "INE0002", "INE0003", "INE0004", "INE0005", "INE0006", "INE0007", "INE0008", "INE0009", "INE0010", "INE0011",  "INE0012",  "INE0013", "INE0014", "INE0015"]
    const tokens = ["INE0001"]

    const operators = [
        // ["0x49c90F5722c68afdd1C5b0aC8e5835bb52F1f294", "8a3ce9e6859b22552053df3f31ecc4d46952c8acb1a46a2e0a5921ae4555801c"],
        ["0xB4ab92133e4b5869453253B690174Cd85075d9bb", "817c9914967cc82cdca30b74b63e9d702eb4e290561ce9f1003cdb2af83c42c3"],
        // ["0x994fABd6AD250BC84A0081f12336AD396e69185E", "fbb4661a6299b163d0ccff4ae21dd85a4d18d5bed4e3ac63e479a4a707656a8d"]
    ]

    const receivers = [
       ["0x6359eF0343F103E4846142019c4a035999B15D5c", "b35f839e529599f8c51534ca99b7bdd4b948a671f837a21a36e4230090d2b93d"],
    //    ["0x07F288CabdAA5C02C9F7CF90C4a43F59778c399f", "fe4a873b8343d90859319e721a4ec0eb89243e1255b30d41934dc0e463208ebe"],
    //    ["0x45368DF1ff1735d70065D61556424DB41e12d6F4", "93c75d863a448d1cd63860aea80a7f8f455ddc42744181179834fa7d9d284c54"],
    //    ["0x69E5D090389ab016ba606db83E1d86E4322c4025", "45744f8514845dab66045815f0e651faec6a5e534fe653156a7750fc5d4f9b93"],
    //    ["0xceBc565d8c2e27001262f5641FF7118441CA1c75", "a5e5e099a7ddada1e37c042c4a64e3d0a9f48092921f6e1762b75734d323d668"],
    //    ["0xd2c16504400CdcACAB3e64E94D9A84d04e72B3fc", "a0140bdfcd2fce047c6449c197ec0fb6d8171713a50f1eeeb35ee05a510b673e"],
    //    ["0xB07bDA63af0f16683aA4785154d2e6442C90a948", "a2b09fd2fb9c13f1b68b8137f13c720f8514982476ac570297df3ec0fa3faa27"],
    //    ["0xe34166ef0bb12c7F53808482149eEd65249999Ca", "c6df5d2f45d726af22783aebcd43112d60a52e43ffbecd8455647423e5f1a046"]
    ]

    let chain = []

    // try {
    //     operators.forEach(operator => {
    //         tokens.forEach(token => {
    //             chain.push(async () => {
    //                 try {
    //                     console.log(`Enabling ${operator[0]} to token ${token}`)
    //                     const receipt = await SBTContract.enableOperator(operator[0], token, {
    //                         gasPrice: ethers.utils.parseUnits('100','gwei').toString(),
    //                         gasLimit: 400000
    //                       })

    //                     console.log(`Done: ${operator[0]} to token ${token}`)
    //                 } catch (error) {
    //                     console.log(error)
    //                     console.log('[-] Error')
    //                 }
    //             })
    //         })
    //     })

    //     for await (let tx of chain) {
    //         await tx()
    //     }
    // } catch (error) {
    //     console.log(error)
    // }

    try {
        operators.forEach(operator => {
            tokens.forEach(token => {
                receivers.forEach(receiver => {
                    chain.push(async () => {
                        try {
                            console.log(`Minting ${token} to ${receiver[0]}`)

                            const _signer = new ethers.Wallet(operator[1], provider);
                            const _contract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, _signer);

                            const receipt = await _contract.mint(v4(), token, receiver[0], {
                                gasPrice: ethers.utils.parseUnits("50", 'gwei').toString(),
                                gasLimit: 300000
                            })

                            console.log(receipt)
                        } catch (error) {
                            console.log(error)
                            console.log('[-] Error')
                        }
                    })
                })
            })
        })

        for await (let tx of chain) {
            await tx()
        }
    } catch (error) {
        console.log(error)
    }
}

main();
