import { useState } from 'react'
import './App.css'
import { generateMnemonic } from 'bip39';
import { SolanaWallet } from './component/SolanaWallet';
import { EthWallet } from './component/EthWallet';

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [importmnemonic, setImportMnemonic] = useState("");

  return (
    <div>
      <textarea onChange={(e)=>{
        setImportMnemonic(e.target.value);
      }}/>
      <br /> <br/>
      <button onClick={()=>{
        setMnemonic(importmnemonic)
      }}>
        Import Seed Phrase
      </button>
      <span> or </span>
      <button onClick={()=>{
        const mn = generateMnemonic();
        // console.log(mn);
        setMnemonic(mn);
      }}>
        Create Seed Phrase
      </button>
      <br/><br/>
      <div>Your Seed Phrase</div>
      <div>{mnemonic}</div>
      <br />
      <SolanaWallet mnenomic={mnemonic}/>
      <br/>
      <EthWallet mnemonic={mnemonic}/>
    </div>
  )
}

export default App
