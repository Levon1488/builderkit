import React, { useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { TokenChip, TokenList } from '../../tokens';
import { ChainIcon } from '../../chains';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../common/components/Dialog';
import { MultiChainTokenInputProps } from '../types';

export const MultiChainTokenInput: React.FC<MultiChainTokenInputProps> = (props) => {
    const { selected, list, onSelectionChanged, showBalances, className } = props;

    const [selectedToken, setSelectedToken] = useState(list.find(t => t.address === selected.address && t.chain_id === selected.chain_id));
    const [selectedChain, setSelectedChain] = useState(selected.chain_id);
    const [open, setOpen] = useState(false);

    let chains: number[] = [];
    list.forEach(t => {
        if (chains.indexOf(t.chain_id) === -1) {
            chains.push(t.chain_id);
        }
    });

    const onClick = (address: string) => {
        list.filter(t => t.chain_id === selectedChain).forEach(t => {
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

    const tokens = useMemo(() => <TokenList selected={selected.chain_id === selectedChain ? selected : undefined} 
        list={list.filter(t => t.chain_id === selectedChain)} onClick={onClick} chain_id={selectedChain} showBalances={showBalances}></TokenList>, [selected, selectedChain]);
    
    return (
        <Dialog open={open}>
            {
                selectedToken && <DialogTrigger onClick={() => { setOpen(true); }}>
                    <div className={cn("flex relative items-center gap-4 cursor-pointer", className)}>
                        <TokenChip address={selectedToken.address} chain_id={selectedToken.chain_id} name={selectedToken.name} symbol={selectedToken.symbol} showChainIcon={true}></TokenChip>
                        <ChevronDown />
                    </div>
                </DialogTrigger>
            }
            <DialogContent className='bg-white text-foreground'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <ArrowLeft size={16} className='cursor-pointer' onClick={() => { setOpen(false); }}></ArrowLeft>
                        Select a token
                    </DialogTitle>
                    <DialogDescription className='flex flex-col gap-4 rounded-md py-4'>
                        <div className='flex items-center gap-2'>
                            {
                                chains.map(chain =>
                                    <div key={chain} className={`border rounded-md hover:bg-primary hover:cursor-pointer ${chain === selectedChain ? "border-[2px] border-red-300" : ""}`}
                                        onClick={() => { setSelectedChain(chain) }}>
                                        <ChainIcon chain_id={chain} className='p-2'></ChainIcon>
                                    </div>
                                )
                            }
                        </div>
                        { tokens }
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
