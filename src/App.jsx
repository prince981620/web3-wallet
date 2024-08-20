import { useState } from 'react'
import './App.css'
import { generateMnemonic } from 'bip39';
import { EthWallet } from './component/EthWallet';
import  {  SolanaWallet }  from './component/SolanaWallet';
import { BackgroundBeams } from './component/ui/background-beams';

function App() {
  const buttonStyle = "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
  const [label,setLabel] = useState("Switch to Devnet");
  const [refresh,setRefresh] = useState(0);
  const [mnemonic, setMnemonic] = useState("");
  const [importmnemonic, setImportMnemonic] = useState("");
  const [net,setNet] = useState("mainnet");
  function switchNet(){
    net === "mainnet"?setNet("devnet"):setNet("mainnet");
  }

  return (
    <div className="h-screen w-screen rounded-md bg-neutral-950 overflow-clip relative flex flex-col items-center justify-center antialiased">
      <div className='z-50'>
      <button className={buttonStyle} onClick={()=>{
        setRefresh(refresh+1);
      }}>Refresh Balance</button>
      <button className={buttonStyle} id='switchButton' onClick={()=>{
        switchNet();
        label === "Switch to Devnet"?setLabel("Swith to Mainnet"):setLabel("Switch to Devnet");
      }}>{label}</button>
      <input placeholder='Enter Your Seed Phrase' className='mt-5 mb-5 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e)=>{
        setImportMnemonic(e.target.value);
      }}/>
      <button className={buttonStyle} onClick={()=>{
        if(importmnemonic == ""){
          alert("Empty Seed Phrse Please insert phrse into input Area");
        }else{
          setMnemonic(importmnemonic);
        }
      }}>
        Import Seed Phrase
      </button>
      <span className='ml-2 mr-4 font-black text-white'> OR </span>
      <button className={buttonStyle} onClick={async ()=>{
        const mn = generateMnemonic();
        setMnemonic(mn);
      }}>
        Create Seed Phrase
      </button>
      <label className='mt-3 block mb-2 text-sm font-black text-green-700 dark:text-green-500'>Your Seed Phrase</label>
      <div  className='block min-h-7 min-w-40 mb-2 text-sm font-medium text-white dark:text-white-500 border-2 pl-3 pr-3'>{mnemonic}</div>
      <br />
      <SolanaWallet buttonStyle={buttonStyle} refreshCounter={refresh} mnemonic={mnemonic} net={net}/>
      <br/>
      <EthWallet buttonStyle={buttonStyle} refreshCounter={refresh} mnemonic={mnemonic} net={net}/>
    </div>
      <BackgroundBeams />
    </div>
    
  )
}


export default App;


