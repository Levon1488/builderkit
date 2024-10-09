import React, { useEffect, useState } from 'react';
import { TokenRow } from './TokenRow';
import { Input } from '../../input';
import { Search, TriangleAlert } from 'lucide-react';
import { isAddress } from 'viem';
import { Button } from '../../control';
import { useTokens } from './../hooks/useTokens';
import { search } from '../../common/utils/common.utils';
import { useGlacier } from '../../common';
import { BigNumber } from "bignumber.js";
import { useAccount } from 'wagmi';
import { TokenListProps } from '../types';

export const TokenList: React.FC<TokenListProps> = (props) => {
    const { selected, chain_id, list, onClick, showBalances = false, className } = props;

    const [filtered, setFiltered] = useState<any[]>(list);
    const { getCustomToken } = useTokens();
    
    const { getChainInformation, listErc20Balances } = useGlacier();

    const { address, status } = useAccount();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        if (status === "connecting") {
            return;
        }
        if (address === undefined) {
            setMounted(false);
            return;
        }
        setMounted(true);
        // get balances
        if (showBalances === false) {
            return;
        }
        getChainInformation(chain_id) // todo: go with chain id HEX insted
            .then(async r => {
                await listErc20Balances(chain_id, address).then((balances: any) => {
                    balances.forEach((v: any) => {
                        let token = list.find(t => t.address.toLowerCase() == v.address.toLowerCase() && t.chain_id === chain_id);
                        if (token === undefined) {
                            return;
                        }
                        token.balance = new BigNumber(v.balance).div(10 ** v.decimals);
                    });
                    setFiltered([...list]);
                });
            })
            .catch(e => {
                console.log(e); // possibly chain is not supported by glacier api
            });
    }, [status, address, chain_id]);

    useEffect(() => {
        setFiltered(list);
    }, [list, chain_id])

    const onInputChange = (input: string) => {
        if (input === "") {
            setFiltered(list);
            return;
        }
        // Check if given value is address?
        if (isAddress(input) === true) {
            let token = list.find(t => t.address.toLowerCase() === input.toLowerCase());
            if (token !== undefined) {
                setFiltered([token]);
            } else {
                // // Query custom token
                // getCustomToken(chain_id, input).then((r: any) => {
                //     if (r === undefined) {
                //         return;
                //     }
                //     setFiltered([{
                //         address: input,
                //         name: r[0],
                //         symbol: r[1],
                //         whitelisted: false
                //     }]);
                // }).catch(() => {
                //     setFiltered([]);
                // });
                // TODO: omitted for now
            }
        } else {
            setFiltered(search(list, input, ["name", "symbol"]));
        }
    }

    return (
        <div className='flex flex-col gap-4 rounded-md py-4'>
            <Input className='bg-gray-100 text-foreground rounded-md' type='text' 
                placeholder='Search by name or paste contract address' icon={<Search />} 
                onChange={onInputChange} disabled={false}></Input>
            {
                <div className='h-[250px] flex flex-col divide-y scrollbar overflow-y-auto'>
                    {
                        filtered.map(t =>
                            t.whitelisted !== undefined && t.whitelisted === false ? <div key={t.address} className='grid gap-2'>
                                <TokenRow className="text-primary-foreground p-2 opacity-50 w-full" address={t.address} name={t.name} symbol={t.symbol} chain_id={t.chain_id} balance={t.balance}></TokenRow>
                                <div className='w-full flex justify-center'>
                                    <span className='text-xs italic flex items-center gap-2'><TriangleAlert color='#ffc107' /> Token is not whitelisted. You need to import it before using it.</span>
                                </div>
                                <Button label='Import' action={() => { }} className='bg-green-700 hover:bg-green-600 text-white px-2 py-2 rounded-md'></Button>
                            </div> :
                                <TokenRow key={t.address} className={`text-black p-2 ${t.address === selected?.address ? "opacity-50 hover:cursor-not-allowed" : "hover:bg-primary hover:cursor-pointer"}`} 
                                    address={t.address} name={t.name} symbol={t.symbol} chain_id={t.chain_id} balance={t.balance} onClick={() => onClick(t.address)}></TokenRow>
                        )
                    }
                </div>
            }
        </div>
    );
};
