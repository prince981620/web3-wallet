import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";


export function SolanaWallet({mnemonic}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [dividnumer,setDividnumber] = useState(0);
    function handelClick() {
        console.log("working");
        const seed = mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, keypair.publicKey]);
    }

    return (
        <div>
            <button onClick={handelClick}>
            Add Solana wallet
        </button>
        <br />
        {publicKeys.map((p,index) => <div key={index}>
            {p.toBase58()}
            {console.log(p.tobase58())}
            <br></br>
            <button onClick={async ()=>{
                try {
                const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
                const walletBalance = await connection.getBalance(p);
                console.log(p);
                console.log("wallet Balance is " + walletBalance/LAMPORTS_PER_SOL + " sol");
                document.getElementById("Balance").innerHTML= ("wallet Balance is " + walletBalance/LAMPORTS_PER_SOL + " sol");
                }catch (e) {
                    console.log(e);
                }
            }}>get Balance</button>
            <div id={`Balance${dividnumer}`}></div>
        </div>)}
        </div>
    )
}