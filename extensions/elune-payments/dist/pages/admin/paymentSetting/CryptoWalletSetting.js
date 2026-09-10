import { InputField } from '@components/common/form/InputField.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
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
        defaultValue: cryptoWalletBtc
    })))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "pt-4 border-t border-border"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "col-span-1 items-center flex"
    }, /*#__PURE__*/ React.createElement("h4", null, _('USDT Wallet'))), /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "crypto_wallet_usdt",
        placeholder: _('TRON TRC-20 wallet address'),
        defaultValue: cryptoWalletUsdt
    })))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "pt-4 border-t border-border"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "col-span-1 items-center flex"
    }, /*#__PURE__*/ React.createElement("h4", null, _('ETH Wallet'))), /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2"
    }, /*#__PURE__*/ React.createElement(InputField, {
        name: "crypto_wallet_eth",
        placeholder: _('Ethereum ERC-20 wallet address'),
        defaultValue: cryptoWalletEth
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
