import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { TokenChip, TokenList } from '../../tokens';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../common/components/Dialog';
import { TokenInputProps } from '../types';

export const TokenInput: React.FC<TokenInputProps> = (props) => {
    const { selected, chain_id, list, onSelectionChanged, showBalances, className } = props;

    const [selectedToken, setSelectedToken] = useState(list.find(t => t.address === selected.address));

    useEffect(() => {
        setSelectedToken(list.find(t => t.address === selected.address));
    }, [selected]);

    const [open, setOpen] = useState(false);

    const onClick = (address: string) => {
        list.forEach(t => {
            if (t.address === address) {
                t.selected = true;
                if (onSelectionChanged) {
                    onSelectionChanged(t);
                }
                setSelectedToken(t);
                return;
            }
            t.selected = false;
        });
        setOpen(false);
    };

    return (
        <Dialog open={open}>
            {
                selectedToken && <DialogTrigger onClick={() => { setOpen(true); }} className='w-full'>
                    <div className={cn("flex relative items-center gap-4 cursor-pointer justify-between", className)}>
                        <TokenChip chain_id={selectedToken.chain_id} address={selectedToken.address} name={selectedToken.name} symbol={selectedToken.symbol} showName={false}></TokenChip>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </DialogTrigger>
            }
            <DialogContent className='bg-white text-foreground'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <ArrowLeft size={16} className='cursor-pointer' onClick={() => { setOpen(false); }}></ArrowLeft>
                        Select a token
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <TokenList selected={selectedToken} chain_id={chain_id} list={list} onClick={onClick} showBalances={showBalances}></TokenList>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
