import React, { useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { TokenIcon } from './TokenIcon';
import { TokenIconWithChain } from './TokenIconWithChain';
import { Check, Copy } from 'lucide-react';
import { TokenChipProps } from '../types';

export const TokenChip: React.FC<TokenChipProps> = (props) => {
    const { address, chain_id, name, symbol, allowCopyToClipboard, showChainIcon = false, showName = true, className } = props;

    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    const icon = useMemo(() => showChainIcon === true ?
        <TokenIconWithChain chain_id={chain_id} address={address}></TokenIconWithChain> :
        <TokenIcon chain_id={chain_id} address={address}></TokenIcon>, [address, chain_id]);

    return (
        <div className={cn("flex relative items-center justify-center gap-2", className)}>
            {icon}
            <div className='flex flex-col items-start'>
                <span className='text-sm'>{ showName === true ? name : symbol}</span>
                {showName === true && <span className='text-xs opacity-50'>{symbol}</span>}
            </div>
            {
                allowCopyToClipboard && (copied === false ?
                    <Copy onClick={copyToClipboard} size={16} className='cursor-pointer' /> :
                    <Check size={16} />)
            }
        </div>
    );
};
