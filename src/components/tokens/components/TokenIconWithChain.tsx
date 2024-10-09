import React from 'react';
import { Icon } from '../../common';
import { cn } from '../../../utils/cn';
import { TokenIconWithChainProps } from '../types';
import { TokenIcon } from './TokenIcon';

// TODO: take a look at here before push
export const TokenIconWithChain: React.FC<TokenIconWithChainProps> = (props) => {
    const { address, chain_id, className } = props;

    return (
        <div className={"flex relative items-center justify-center"}>
            <TokenIcon chain_id={chain_id} address={address} className={className}></TokenIcon>
            <Icon src={`/chains/logo/${chain_id}.png`} className={cn("absolute scale-50 -translate-x-1/4 translate-y-1/3 border border-[4px] rounded-full", className)}></Icon>
        </div>
    );
};
