import React from 'react';
import { Icon } from '../../../components/common';
import { ChainIconProps } from '../types';

export const ChainIcon: React.FC<ChainIconProps> = (props) => {
    const { chain_id, className } = props;

    return (
        <Icon className={className} src={`/chains/logo/${chain_id}.png`}></Icon>
    );
};
