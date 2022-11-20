import { ethers, Signer, Contract, Event } from "ethers";

import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

import contractABI from '../SBTContract.json'

type SBTToken = {
  transactionId: string
  tokenId: string
  tokenReference: string
  blockNumber?: number
  creator: string
}

const INITIAL_BLOCK = 29232966

export default function Home() {
  const [screen, setScreen] = useState<'INITIAL' | 'TOKENS_LIST' | 'VERIFY_ADDRESS'>('INITIAL')
  const [contract, setContract] = useState<Contract>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [address, setAddress] = useState<string>()
  const [signer, setSigner] = useState<Signer>()
  const [tokens, setTokens] = useState<SBTToken[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addressToSearch, setAddressToSearch] = useState<string>('')

  const iface = new ethers.utils.Interface(contractABI.abi)

  useEffect(() => {
    handleConnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConnect = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum, 80001)
    await provider.send("eth_requestAccounts", []);
    const _signer = provider.getSigner()
    const _contract = new ethers.Contract( '0x2505560418052e8859D6Aa7b5Cb877E2F8F6e694' , contractABI.abi , _signer )

    setSigner(_signer)
    setContract(_contract)
    setProvider(provider)
    setAddress(await _signer.getAddress())

    setIsLoading(false)
  }

  const handleTokenList = async (addressToSearch: string) => {
    if (!contract || (!provider)) return;
    setIsLoading(true)
    setTokens([])
    const chain = []

    const latestBlock = await provider.getBlock("latest")

    for (let index = 0; index < Math.floor((latestBlock.number - INITIAL_BLOCK)/1000) + 1; index++) {
     const blockFrom = INITIAL_BLOCK + (1000 * index);
     const blockTo = (blockFrom + 1000) > latestBlock.number ? latestBlock.number : blockFrom + 1000;

     chain.push(contract.queryFilter(contract.filters.Mint(null, null, addressToSearch), blockFrom, blockTo))
    }

    await Promise.all(chain)
      .then((events) => {
        events.flatMap((event) => event)
          .forEach((event) => appendMintEvent(event))
      })
      .catch(e => {
        console.error(e)
      })

    setIsLoading(false)
  }

  const handleBack = () => {
    setScreen('INITIAL')
    setTokens([])
  }

  const appendMintEvent = async (event: Event) => {
    const transaction = await event.getTransaction()
    let decodedData = iface.parseTransaction({ data: transaction.data, value: transaction.value });

    const _token : SBTToken = {
      transactionId: transaction.hash,
      tokenId: decodedData.args[0],
      tokenReference: decodedData.args[1],
      blockNumber: transaction.blockNumber,
      creator: transaction.from
    }

    setTokens((prevValue) => ([ ...prevValue, _token ]))
  }

  const MyTokens = ({ tokens } : { tokens: SBTToken[] }) => {
    return (
      <>
        <div className={styles.backButton} onClick={handleBack}>{`<- Back`}</div>
        {isLoading && (<div>Loading...</div>)}
        <TokensList tokens={tokens} />
      </>
    )
  }

  const TokensList = ({ tokens } : { tokens: SBTToken[] }) => {
    return (
      <table className={styles.tokensList}>
        <tr>
          <th>tokenId</th>
          <th>tokenReference</th>
          <th>blockNumber</th>
          <th>creator</th>
          <th>TX</th>
        </tr>
        {tokens.map((t) => (
          <tr key={t.tokenReference}>
            <td>{t.tokenId}</td>
            <td>{t.tokenReference}</td>
            <td>{t.blockNumber}</td>
            <td>{t.creator}</td>
            <td><a href={`https://mumbai.polygonscan.com/tx/${t.transactionId}`} target="none">TX</a></td>
          </tr>
        ))}
      </table>
    )
  }

  const VerifyAddress = () => {
    return (
      <>
      <div className={styles.backButton} onClick={handleBack}>{`<- Back`}</div>
        <div className={styles.flex}>
          <input className={styles.flex1} onChange={(e) => setAddressToSearch(e.target.value)} />
          <button onClick={() => handleTokenList(addressToSearch)}>verify</button>
        </div>
        {isLoading && (<div>Loading...</div>)}
        <TokensList tokens={tokens} />
      </>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>UFSC SBT</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          UFSC SBT
        </h1>

        {
          signer
            ? (<div className={styles.authed}>
              <div className={styles.wallet}>Wallet: {address}</div>
              <div>
                {(() => {
                  switch (screen) {
                    case 'INITIAL':
                      return (<div className={styles.container}>
                        <button className={styles.button} onClick={() => {
                            setScreen('TOKENS_LIST');
                            handleTokenList(address || '')}
                          }>My tokens</button>
                        <button className={styles.button} onClick={() => setScreen('VERIFY_ADDRESS')}>Verify address</button>
                      </div>)
                    case 'TOKENS_LIST':
                      return (<MyTokens tokens={tokens} />)
                    case 'VERIFY_ADDRESS':
                      return (<VerifyAddress />)
                    default:
                      break;
                  }
                })()}
              </div>
            </div>)
            : (<div>
              {isLoading ? "Loading..." : "error" }
            </div>)
        }


      </main>
    </div>
  )
}
