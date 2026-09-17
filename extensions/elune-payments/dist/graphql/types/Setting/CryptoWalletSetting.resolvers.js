import { isBitcoinAddress, isErc20Address } from '../../../lib/walletAddress.js';
// A rail resolves to a stored address only when that value is an address of the
// rail's own shape. Anything else — unset, the retired TRON USDT placeholder,
// a wrong-network address, a placeholder for another rail — resolves to null, so
// the checkout renders that rail as unconfigured rather than offering a value
// nobody can be paid at as a destination. Key names are unchanged.
function railAddress(setting, name, isValidAddress) {
    const row = setting.find((s)=>s.name === name);
    return row && isValidAddress(row.value) ? row.value.trim() : null;
}
export default {
    Setting: {
        cryptoWalletBtc: (setting)=>railAddress(setting, 'crypto_wallet_btc', isBitcoinAddress),
        cryptoWalletUsdt: (setting)=>railAddress(setting, 'crypto_wallet_usdt', isErc20Address),
        cryptoWalletEth: (setting)=>railAddress(setting, 'crypto_wallet_eth', isErc20Address),
        cryptoWalletInstructions: (setting)=>{
            const val = setting.find((s)=>s.name === 'crypto_wallet_instructions');
            return val ? val.value : 'Send the order total to one of the addresses above, then paste your transaction ID (TXID) into the TXID note field before placing the order. We confirm on-chain and ship after 1 network confirmation.';
        }
    }
};
