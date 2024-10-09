import React from 'react';
import { cn } from '../../../utils/cn';
import { TokenChip } from './TokenChip';
import { BigNumber } from "bignumber.js";
import { TokenRowProps } from '../types';

export const TokenRow: React.FC<TokenRowProps> = (props) => {
    const { chain_id, address, name, symbol, balance, onClick, className } = props;

    return (
        <div className={cn("flex relative items-center justify-between gap-2", className)} onClick={() => {
            if (onClick === undefined) { return; }
            onClick();
        }}>
            <TokenChip chain_id={chain_id} address={address} name={name} symbol={symbol}></TokenChip>
            {balance && <div className='flex flex-col items-end'>
                <span className='text-sm'>{balance === undefined ? 0 : balance.toFixed(3, BigNumber.ROUND_DOWN)}</span>
                <span className='text-xs opacity-50'>$0</span>
            </div>}

        </div>
    );
};
