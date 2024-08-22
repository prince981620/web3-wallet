import { useState } from 'react'
import './App.css'
import { generateMnemonic } from 'bip39';
import { EthWallet } from './component/EthWallet';
import  {  SolanaWallet }  from './component/SolanaWallet';
import { BackgroundBeams } from './component/ui/background-beams';

function App() {
  const buttonStyle = "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
  const [label,setLabel] = useState("Switch to Devnet");
  const [refresh,setRefresh] = useState(0);
  const [mnemonic, setMnemonic] = useState("");
  const [visible,setVisible] = useState(false);
  const [visiblity,setVisiblity] = useState(false);
  const [importmnemonic, setImportMnemonic] = useState("");
  const [net,setNet] = useState("mainnet");
  function switchNet(){
    net === "mainnet"?setNet("devnet"):setNet("mainnet");
  }

  return (
    <div className="h-screen w-screen rounded-md bg-neutral-950 overflow-hidden relative flex flex-col items-center justify-center antialiased">
      <div className='z-50 overflow-y-auto'>
      <button className={buttonStyle} onClick={()=>{
        setRefresh(refresh+1);
      }}>Refresh Balance</button>
      <button className={buttonStyle} id='switchButton' onClick={()=>{
        switchNet();
        label === "Switch to Devnet"?setLabel("Swith to Mainnet"):setLabel("Switch to Devnet");
      }}>{label}</button>
        <div className="relative">
            <input onChange={(e)=>{
                setImportMnemonic(e.target.value);
                }} type={visible?'text':'password'} className="block w-full p-2 mb-2 text-sm  border bg-gray-700 placeholder-gray-400 text-white" placeholder="Enter Your Seed Phrase"/>
                <button onClick={()=>{setVisible(!visible)}} className="text-white bg-gray-700 border-b border-r border-t-0 absolute end-[0px] bottom-[0px] font-medium text-sm px-2 py-2">
                      {!visible && <svg className="w-[21px] h-[21px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd"/>
                </svg>}
                {visible && <svg className="w-[21px] h-[21px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m4 15.6 3.055-3.056A4.913 4.913 0 0 1 7 12.012a5.006 5.006 0 0 1 5-5c.178.009.356.027.532.054l1.744-1.744A8.973 8.973 0 0 0 12 5.012c-5.388 0-10 5.336-10 7A6.49 6.49 0 0 0 4 15.6Z"/>
                  <path d="m14.7 10.726 4.995-5.007A.998.998 0 0 0 18.99 4a1 1 0 0 0-.71.305l-4.995 5.007a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.402.211.59l-4.995 4.983a1 1 0 1 0 1.414 1.414l4.995-4.983c.189.091.386.162.59.211.011 0 .021.007.033.01a2.982 2.982 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"/>
                  <path d="m19.821 8.605-2.857 2.857a4.952 4.952 0 0 1-5.514 5.514l-1.785 1.785c.767.166 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"/>
                </svg>
                } 
            </button>
        </div>
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
      <div className="relative">
            <input type={visiblity?'text':'password'} className="block w-full p-2 mb-2 text-sm  border bg-gray-700 placeholder-gray-400 text-white" value={mnemonic} disabled/>
                <button onClick={()=>{setVisiblity(!visiblity)}} className="text-white bg-gray-700 border-b border-r border-t-0 absolute end-[0px] bottom-[0px] font-medium text-sm px-2 py-2">
                {!visiblity && <svg className="w-[21px] h-[21px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd"/>
                </svg>}
                {visiblity && <svg className="w-[21px] h-[21px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m4 15.6 3.055-3.056A4.913 4.913 0 0 1 7 12.012a5.006 5.006 0 0 1 5-5c.178.009.356.027.532.054l1.744-1.744A8.973 8.973 0 0 0 12 5.012c-5.388 0-10 5.336-10 7A6.49 6.49 0 0 0 4 15.6Z"/>
                  <path d="m14.7 10.726 4.995-5.007A.998.998 0 0 0 18.99 4a1 1 0 0 0-.71.305l-4.995 5.007a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.402.211.59l-4.995 4.983a1 1 0 1 0 1.414 1.414l4.995-4.983c.189.091.386.162.59.211.011 0 .021.007.033.01a2.982 2.982 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"/>
                  <path d="m19.821 8.605-2.857 2.857a4.952 4.952 0 0 1-5.514 5.514l-1.785 1.785c.767.166 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"/>
                </svg>
                } 
            </button>
        </div>
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


