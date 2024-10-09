import React from 'react';
import { ChainIcon } from './ChainIcon';
import { ChainRowProps } from '../types';

export const ChainRow: React.FC<ChainRowProps> = (props) => {
    const { chain_id, name, className } = props;

    return (
        <div className="flex items-center gap-2">
            <ChainIcon chain_id={chain_id}></ChainIcon>
            {name}
        </div>
    );
};
