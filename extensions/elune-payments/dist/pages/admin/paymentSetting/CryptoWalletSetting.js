import { InputField } from '@components/common/form/InputField.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import { isBitcoinAddress, isErc20Address } from '../../../lib/walletAddress.js';
// The customer-facing checkout shows a rail's address only when the stored
// value is an address of that rail's own shape (same predicates the GraphQL
// resolvers read through). Validate on the way in with those predicates too, so
// the admin cannot save a placeholder or an address for the wrong network and
// then wonder why the rail is unavailable. Blank is allowed and means
// "unconfigured" — the checkout says so instead of printing anything.
function addressRule(isValidAddress, hint) {
    return {
        validate: (value)=>!String(value ?? '').trim() || isValidAddress(value) || hint
    };
}
const ETHEREUM_HINT = _('Enter an Ethereum ERC-20 address: 0x followed by 40 hex characters, or leave blank to leave this rail unconfigured');
export default function CryptoWalletPayment({ setting: { cryptoWalletBtc, cryptoWalletUsdt, cryptoWalletEth, cryptoWalletInstructions } }) {
    return /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, _('Crypto Wallet Settings')), /*#__PURE__*/ React.createElement(CardDescription, null, _('Configure your cryptocurrency payment wallet addresses'))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "col-span-1 items-center flex"
    }, /*#__PURE__*/ React.createElement("h4", null, _('BTC Wallet'))), /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "crypto_wallet_btc",
        placeholder: _('Bitcoin wallet address'),
        defaultValue: cryptoWalletBtc,
        validation: addressRule(isBitcoinAddress, _('Enter a Bitcoin address (bc1…, 1… or 3…), or leave blank to leave this rail unconfigured'))
    })))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "pt-4 border-t border-border"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "col-span-1 items-center flex"
    }, /*#__PURE__*/ React.createElement("h4", null, _('USDT — Ethereum (ERC-20)'))), /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "crypto_wallet_usdt",
        placeholder: _('Ethereum ERC-20 wallet address (0x…)'),
        defaultValue: cryptoWalletUsdt,
        validation: addressRule(isErc20Address, ETHEREUM_HINT)
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-muted-foreground text-xs mt-2"
    }, _('USDT is accepted on Ethereum (ERC-20) only. A TRON (TRC-20) address, or any other value that is not an Ethereum address, is never shown to customers as a payment destination.'))))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "pt-4 border-t border-border"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "col-span-1 items-center flex"
    }, /*#__PURE__*/ React.createElement("h4", null, _('ETH Wallet'))), /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "crypto_wallet_eth",
        placeholder: _('Ethereum ERC-20 wallet address (0x…)'),
        defaultValue: cryptoWalletEth,
        validation: addressRule(isErc20Address, ETHEREUM_HINT)
    })))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "pt-4 border-t border-border"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "col-span-1 items-center flex"
    }, /*#__PURE__*/ React.createElement("h4", null, _('Instructions'))), /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "crypto_wallet_instructions",
        placeholder: _('Payment instructions for the customer'),
        defaultValue: cryptoWalletInstructions
    })))));
}
export const layout = {
    areaId: 'paymentSetting',
    sortOrder: 30
};
export const query = `
  query Query {
    setting {
      cryptoWalletBtc
      cryptoWalletUsdt
      cryptoWalletEth
      cryptoWalletInstructions
    }
  }
`;
