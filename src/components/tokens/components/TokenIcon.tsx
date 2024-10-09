import React from 'react';
import { Icon } from '../../common';
import { TokenIconWithChainProps } from '../types';

// TODO: take a look at here before push
export const TokenIcon: React.FC<TokenIconWithChainProps> = (props) => {
    const { chain_id, address, className } = props;
    
    return (
        <Icon className={className} src={`/tokens/logo/${chain_id}/${address}.png`}></Icon>
    );
};
