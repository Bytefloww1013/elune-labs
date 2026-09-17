// Wrong-network guard: the USDT rail is Ethereum (ERC-20), and the checkout may
// only ever show or copy a destination that is an address of its rail's own
// shape. The stored value in this deployment is the retired TRON placeholder
// `TPLACEHOLDER_REPLACE_ME`, so this is a live boundary, not a hypothetical one.
// Node's built-in runner, no dependencies: `node --test tests/`.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isBitcoinAddress,
  isErc20Address
} from '../src/lib/walletAddress.js';
import resolvers from '../src/graphql/types/Setting/CryptoWalletSetting.resolvers.js';

const ERC20_ADDRESS = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';
const ERC20_ADDRESS_LOWER = '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad';
const BTC_ADDRESS = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const TRON_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const BTC_PLACEHOLDER = 'bc1qPLACEHOLDER_REPLACE_ME';

const setting = (rows) => rows.map(([name, value]) => ({ name, value }));

test('accepts 0x + 40 hex in either hex case', () => {
  assert.equal(isErc20Address(ERC20_ADDRESS), true);
  assert.equal(isErc20Address(ERC20_ADDRESS_LOWER), true);
  assert.equal(isErc20Address(`  ${ERC20_ADDRESS}  `), true);
});

test('rejects a TRON address, a placeholder, and near-misses', () => {
  for (const value of [
    TRON_ADDRESS, // the rail's old network — the whole point of the guard
    'TPLACEHOLDER_REPLACE_ME', // the value actually stored in this deployment
    '0xTPLACEHOLDER_REPLACE_ME',
    '0xPLACEHOLDER_REPLACE_ME',
    '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FA', // 39 hex digits
    '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD0', // 41 hex digits
    '3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', // no 0x
    '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FADZZ', // non-hex tail
    '',
    '   '
  ]) {
    assert.equal(isErc20Address(value), false, `${value} must not be payable`);
  }
  for (const value of [undefined, null, 42, {}, []]) {
    assert.equal(isErc20Address(value), false);
  }
});

test('bitcoin shape rejects its own sentinel and accepts both standard shapes', () => {
  assert.equal(isBitcoinAddress(BTC_ADDRESS), true);
  assert.equal(isBitcoinAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'), true);
  assert.equal(isBitcoinAddress(BTC_PLACEHOLDER), false);
  assert.equal(isBitcoinAddress(ERC20_ADDRESS), false);
  assert.equal(isBitcoinAddress(undefined), false);
});

test('USDT resolves to null for the stale TRON setting, never relabelled', () => {
  const stale = setting([
    ['crypto_wallet_usdt', 'TPLACEHOLDER_REPLACE_ME']
  ]);
  assert.equal(resolvers.Setting.cryptoWalletUsdt(stale), null);

  const tron = setting([['crypto_wallet_usdt', TRON_ADDRESS]]);
  assert.equal(resolvers.Setting.cryptoWalletUsdt(tron), null);

  const missing = setting([['crypto_wallet_usdt', undefined]]);
  assert.equal(resolvers.Setting.cryptoWalletUsdt(missing), null);

  const configured = setting([['crypto_wallet_usdt', ERC20_ADDRESS]]);
  assert.equal(resolvers.Setting.cryptoWalletUsdt(configured), ERC20_ADDRESS);
});

test('BTC and ETH rails fail closed on their own placeholders', () => {
  const placeholders = setting([
    ['crypto_wallet_btc', 'bc1qPLACEHOLDER_REPLACE_ME'],
    ['crypto_wallet_eth', '0xPLACEHOLDER_REPLACE_ME']
  ]);
  assert.equal(resolvers.Setting.cryptoWalletBtc(placeholders), null);
  assert.equal(resolvers.Setting.cryptoWalletEth(placeholders), null);

  const configured = setting([
    ['crypto_wallet_btc', BTC_ADDRESS],
    ['crypto_wallet_eth', ERC20_ADDRESS]
  ]);
  assert.equal(resolvers.Setting.cryptoWalletBtc(configured), BTC_ADDRESS);
  assert.equal(resolvers.Setting.cryptoWalletEth(configured), ERC20_ADDRESS);
});