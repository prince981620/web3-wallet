import { useState,useCallback,useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, ethers } from "ethers";
import axios from "axios";
import Loader from "./ui/loader";


export const EthWallet = ({buttonStyle,mnemonic,net,refreshCounter}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [visible,setVisible] = useState(false);
    const [visiblity,setVisiblity] = useState(false);
    const [loading,setLoading] = useState(false);
    const mainnetRPC = "https://fittest-white-sound.quiknode.pro/2f08cc49d2b9b2116d50437b2105afe0b63b98bb";
    const devnentRPC = "https://fittest-white-sound.ethereum-sepolia.quiknode.pro/2f08cc49d2b9b2116d50437b2105afe0b63b98bb";
    const etherQuickNode_RPC = net === "mainnet"?mainnetRPC:devnentRPC;
    
    const fetchBalance = useCallback(async (address)=>{
        try{
            const response = await axios.post(etherQuickNode_RPC,{
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBalance",
                params: [address, "latest"]
            })
            return (parseInt(response.data.result))/10**18;
        }catch(e){
            console.log("error while fetchiung balance",e);
            return 0;
        }
    },[etherQuickNode_RPC]);

    const refreshBalanceEth = useCallback(async ()=>{
        const newAdress = await Promise.all(addresses.map(async (a)=>{
            const walletBalance = await fetchBalance(a.walletadd);
            return {...a,walletBalance}
        }));
        setAddresses(newAdress);
    },[addresses,etherQuickNode_RPC]);

    useEffect(()=>{
        refreshBalanceEth();
    },[net,refreshCounter]);

    

    const addNewAddress = useCallback(async ()=>{
        if(mnemonic===""){
            alert("Empty Seed Phrase");
            return;
        }
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/0'/0/${currentIndex}`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        const walletadd = wallet.address;
        const walletBalance = await fetchBalance(walletadd);
        setCurrentIndex(currentIndex + 1);
        setAddresses((prevaddress)=>[
            ...prevaddress,
            {walletadd,walletBalance,child}]);
    },[mnemonic,currentIndex,fetchBalance]);

    const [transAddress,setTransAddress] = useState('');
    const [desAdd,setDestAdd] = useState('');
    const [transferAmt,setTransferAmt] = useState(0);

    const transferEth = useCallback(async()=>{
        try {
            const provider = new ethers.JsonRpcProvider(etherQuickNode_RPC);
            const wallet = new Wallet(addresses.find(addr => addr.walletadd === transAddress).child.privateKey, provider);
            const tx = await wallet.sendTransaction({
                to: desAdd,
                value: ethers.parseEther(transferAmt.toString())
            });
            console.log('Transaction hash',tx.hash);
            await tx.wait();
            refreshBalanceEth();
            alert("Transaction successfull");
        }catch(e){
            console.error("Error while sending Eth", e);
            alert("Transaction Failed");
        }
    },[addresses,transAddress,desAdd,transferAmt,etherQuickNode_RPC])

    const airDropEth = useCallback(()=>{
        // add airdrop functionality
    },[])

    return (
        <div>
            <button className={buttonStyle} onClick={addNewAddress}>Add ETH wallet</button>
            {loading && <Loader/>}
            {visible && <div>
            <span className="font-black ml-5 text-white">From: </span>
            <input className="min-w-96 ml-6 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={transAddress} disabled /><br />
            <span className="font-black ml-11 text-white"> To: </span>
            <input className="w-96 mt-2 ml-6 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Recipient's Eth Address" onChange={(e) => { setDestAdd(e.target.value) }} /><br />
            <span className="font-black text-white"> Amount: </span>
            <input className="w-96 mt-2 ml-6 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" placeholder="Amount" onChange={(e) => setTransferAmt(e.target.value)} /><br />
            <button className="text-white mt-2 ml-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 min-w-60" onClick={async () => {
                setVisible(!visible);
                setLoading(true);
                await transferEth();
                setLoading(false);
                refreshBalanceEth();
            }}>Confirm</button>
        </div>}
        {visiblity && <div>
            <span className="font-black ml-5 text-white">To: </span>
            <input className="min-w-96 ml-10 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={transAddress} disabled /><br />
            <span className="font-black text-white"> Amount: </span>
            <input className="w-96 mt-2 ml-4 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" placeholder="Amount" onChange={(e) => setTransferAmt(e.target.value)} /><br />
            <button className="text-white mt-2 ml-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 min-w-60" onClick={async () => {
                setVisiblity(!visiblity);
                setLoading(true);
                await airDropEth();
                setLoading(false);
                refreshBalanceEth();
            }}>Confirm</button>
        </div>}
            {addresses.map(({walletadd,walletBalance},index) => <div className="border border-sky-500 text-white" key={index}>
                <span className="font-black">Eth</span> - {walletadd} <span className="font-black text-white">{`Balance : ${walletBalance} ETH`}</span><br />
                <button className="text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2 text-center ml-2 me-2 mb-3 mt-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800" onClick={()=>{
                    setVisiblity(false);
                    setVisible(!visible);
                    setTransAddress(walletadd);
                }}>Transfer Eth</button>
                <button className="text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2 text-center ml-2 me-2 mb-3 mt-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800" onClick={() => {
                    if(net === "mainnet"){
                        alert("Not Applicable on Mainnet");
                        return;
                    }
                    window.open('https://cloud.google.com/application/web3/faucet/ethereum/sepolia', '_blank', 'noopener,noreferrer')
                    // window.location.replace('https://cloud.google.com/application/web3/faucet/ethereum/sepolia');
                    // setVisible(false);
                    // setVisiblity(!visiblity);
                    // setTransAddress(walletadd);
                }}>Airdrop Eth</button>
            </div>)}
        </div>
    )
}
