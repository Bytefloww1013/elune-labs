import { InputField } from '@components/common/form/InputField.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

interface CryptoWalletPaymentProps {
  setting: {
    cryptoWalletBtc: string;
    cryptoWalletUsdt: string;
    cryptoWalletEth: string;
    cryptoWalletInstructions: string;
  };
}

export default function CryptoWalletPayment({
  setting: { cryptoWalletBtc, cryptoWalletUsdt, cryptoWalletEth, cryptoWalletInstructions }
}: CryptoWalletPaymentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{_('Crypto Wallet Settings')}</CardTitle>
        <CardDescription>
          {_('Configure your cryptocurrency payment wallet addresses')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>{_('BTC Wallet')}</h4>
          </div>
          <div className="col-span-2">
            <InputField
              name="crypto_wallet_btc"
              placeholder={_('Bitcoin wallet address')}
              defaultValue={cryptoWalletBtc}
            />
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>{_('USDT Wallet')}</h4>
          </div>
          <div className="col-span-2">
            <InputField
              name="crypto_wallet_usdt"
              placeholder={_('TRON TRC-20 wallet address')}
              defaultValue={cryptoWalletUsdt}
            />
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>{_('ETH Wallet')}</h4>
          </div>
          <div className="col-span-2">
            <InputField
              name="crypto_wallet_eth"
              placeholder={_('Ethereum ERC-20 wallet address')}
              defaultValue={cryptoWalletEth}
            />
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 items-center flex">
            <h4>{_('Instructions')}</h4>
          </div>
          <div className="col-span-2">
            <InputField
              name="crypto_wallet_instructions"
              placeholder={_('Payment instructions for the customer')}
              defaultValue={cryptoWalletInstructions}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
