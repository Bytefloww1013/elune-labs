export default {
    Setting: {
        cryptoWalletBtc: (setting)=>{
            const val = setting.find((s)=>s.name === 'crypto_wallet_btc');
            return val ? val.value : 'bc1qPLACEHOLDER_REPLACE_ME';
        },
        cryptoWalletUsdt: (setting)=>{
            const val = setting.find((s)=>s.name === 'crypto_wallet_usdt');
            return val ? val.value : 'TPLACEHOLDER_REPLACE_ME';
        },
        cryptoWalletEth: (setting)=>{
            const val = setting.find((s)=>s.name === 'crypto_wallet_eth');
            return val ? val.value : '0xPLACEHOLDER_REPLACE_ME';
        },
        cryptoWalletInstructions: (setting)=>{
            const val = setting.find((s)=>s.name === 'crypto_wallet_instructions');
            return val ? val.value : 'Send the order total to one of the addresses above, then paste your transaction ID (TXID) into the TXID note field before placing the order. We confirm on-chain and ship after 1 network confirmation.';
        }
    }
};
