import { memo, useCallback, useEffect, useState } from "react";
import bs58 from 'bs58';
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import nacl from "tweetnacl";
import axios from "axios";

export const SolanaWallet = ({ mnemonic,buttonStyle, net, refreshCounter }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallet, setWallet] = useState([]);
    const [visible, setVisible] = useState(false);
    const mainnetRpc = "https://fittest-white-sound.solana-mainnet.quiknode.pro/2f08cc49d2b9b2116d50437b2105afe0b63b98bb";
    const devnetRpc = "https://fittest-white-sound.solana-devnet.quiknode.pro/2f08cc49d2b9b2116d50437b2105afe0b63b98bb";
    const solanaQuickNode_RPC = net === "mainnet" ? mainnetRpc : devnetRpc;

    const refreshBalanceSol = useCallback(async () => {
        const newWallet = await Promise.all(wallet.map(async (w) => {
            const balance = await fetchBalance(w.publicKey);
            return { ...w, balance };
        }));
        setWallet(newWallet);
    }, [wallet, solanaQuickNode_RPC]);

    useEffect(() => {
        refreshBalanceSol();
    }, [net, refreshCounter]);

    const fetchBalance = useCallback(async (pubKey) => {
        try {
            const response = await axios.post(solanaQuickNode_RPC, {
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [pubKey]
            });
            return response.data.result.value / LAMPORTS_PER_SOL;
        } catch (e) {
            console.log("Error while fetching balance", e);
            return 0;
        }
    }, [solanaQuickNode_RPC]);

    const addWallet = useCallback(async () => {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const keypair = Keypair.fromSeed(derivedSeed);
        const publicKey = keypair.publicKey.toBase58();

        const balance = await fetchBalance(publicKey);
        setWallet((prevWallets) => [
            ...prevWallets,
            { currentIndex, publicKey, balance, keypair },
        ]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, [mnemonic, currentIndex, fetchBalance]);

    const [transPubkey, setTransPubkey] = useState('');
    const [destPubkey, setDestPubkey] = useState('');
    const [transferAmt, setTransferAmt] = useState(0);

    const transferSol = useCallback(async () => {
        console.log(transPubkey,destPubkey,transferAmt);
        try {
            const connection = new Connection(solanaQuickNode_RPC);
            const fromWallet = wallet.find(w => w.publicKey === transPubkey);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromWallet.keypair.publicKey,
                    toPubkey: destPubkey,
                    lamports: transferAmt * LAMPORTS_PER_SOL,
                })
            );

            const signature = await sendAndConfirmTransaction(
                connection,
                transaction,
                [fromWallet.keypair]
            );
            
            refreshBalanceSol();
            alert("Transaction Successful");
            console.log("Transfer Confirmed:", signature);
        } catch (e) {
            console.log("Transaction Failed: ", e);
            alert("Transaction Failed");
        }
    }, [wallet, transPubkey, destPubkey, transferAmt, solanaQuickNode_RPC]);

    return <>
        <button className={buttonStyle} onClick={addWallet}>Add Sol wallet</button>
        {visible && <div>
            <span className="font-black ml-5 text-white">From: </span>
            <input className="min-w-96 ml-6 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={transPubkey} disabled /><br />
            <span className="font-black ml-11 text-white"> To: </span>
            <input className="w-96 mt-2 ml-6 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Recipient's Solana Address" onChange={(e) => { setDestPubkey(e.target.value) }} /><br />
            <span className="font-black text-white"> Amount: </span>
            <input className="w-96 mt-2 ml-6 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" placeholder="Amount" onChange={(e) => setTransferAmt(e.target.value)} /><br />
            <button className="text-white mt-2 ml-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 min-w-60" onClick={async () => {
                await transferSol();
                setVisible(!visible);
                refreshBalanceSol();
            }}>Confirm</button>
        </div>}
        {wallet.map(({ currentIndex, publicKey, balance }, index) => (
            <div className="text-white " key={index}>
                <div className="border border-sky-500">
                {publicKey} <span className="font-black text-white">{`Balance: ${balance} SOL`}</span><br />
                <button className="text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2 text-center ml-2 me-2 mb-3 mt-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800" onClick={() => {
                    setVisible(!visible);
                    setTransPubkey(publicKey);
                }}>Transfer Sol</button>
                </div>
            </div>
        ))}
    </>
}
