
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { BigNumber } from "bignumber.js";
import { Ellipsis } from "lucide-react";
import { useWarpMessenger } from "../components/precompiles";
import { useICTT } from "../components/ictt/hooks/useICTT";
import { Container, getNormalizedBN, Spinner, useChains } from "../components/common";
import { useTokens } from "../components/tokens";
import { ConnectStatusIndicator } from "../components/wallet";
import { ConnectButton } from "../components/control";
import { TransactionManager } from "../components/transaction";
import { AmountInput, MultiChainTokenInput } from "../components/input";
import { ChainDropdown, ChainIcon } from "../components/chains";
import { TokenItem } from "../components/tokens/types";

interface ICTTProps {
    tokens: TokenItem[];
    token_in: string;
    source_chain_id: number;
    destination_chain_id: number;
    className?: string;
}

export const ICTT: React.FC<ICTTProps> = (props) => {
    const { tokens, token_in, source_chain_id, destination_chain_id } = props;

    const { address, status } = useAccount();
    const [mounted, setMounted] = useState(false);

    const [list, setList] = useState(tokens);
    const [input, setInput] = useState<any>(undefined);
    const [sourceChainId, setSourceChainId] = useState(source_chain_id);
    const [sourceInterchainMessenger, setSourceInterchainMessenger] = useState(undefined);
    const [destinationChainId, setDestinationChainId] = useState(destination_chain_id);

    const [chainOptions, setChainOptions] = useState<any>([]);
    const [destination, setDestination] = useState<any>(undefined);
    const [destinationBlockchainId, setDestinationBlockchainId] = useState<any>(undefined);

    const [isMultiHop, setMultiHop] = useState(false);
    const [home, setHome] = useState<any>(undefined);

    const { getInterchainMessenger, send, sendNative, getMessageId, getReceiveTransaction, getHomeHopMessageId } = useICTT();
    const { getBlockchainId } = useWarpMessenger();

    const { getBlock } = useChains();

    const { getBalance, getAllowance, approve } = useTokens();

    const [transactionStatus, setTransactionStatus] = useState<any>(undefined);
    const [transactionData, setTransactionData] = useState<any>(undefined);

    const [messageId, setMessageId] = useState<any>(undefined);
    const [tryCount, setTryCount] = useState(0);

    const [homeMessageId, setHomeMessageId] = useState<any>(undefined);
    const [homeMessageTryCount, setHomeMessageTryCount] = useState(0);

    useEffect(() => {
        updateTokens(token_in, source_chain_id, destination_chain_id);
    }, [token_in, source_chain_id, destination_chain_id]);

    const updateTokens = async (token_in: string, _source_chain_id: number, _destination_chain_id?: number) => {
        if (token_in === undefined) {
            return;
        }
        // set tokens
        const t1 = tokens.find(t => t.address === token_in && t.chain_id === _source_chain_id);
        if (t1 === undefined) {
            return;
        }
        setSourceChainId(_source_chain_id);
        setInput(t1);
        setSourceInterchainMessenger(await getInterchainMessenger(_source_chain_id));
        // find chain options
        let __destination_chain_id: any = _destination_chain_id;
        if (t1.supports_ictt === true) {
            const options = t1.mirrors.map((m: any) => m.chain_id);
            setChainOptions(options);
            __destination_chain_id = _destination_chain_id || options[0];
            setDestinationChainId(__destination_chain_id);
        }
        // find destination
        let t2 = t1.mirrors.find((m: any) => m.chain_id === __destination_chain_id);
        if (t2 === undefined) {
            return;
        }
        setDestination(t2);
        // Check is multi-hop transaction
        const is_multi_hop = t1.is_transferer === true && t2.address === t2.transferer;
        let home = t1.mirrors.find((m: any) => m.home === true);
        setHome(home);
        setMultiHop(is_multi_hop);
        // get destination blockchain id
        setDestinationBlockchainId(await getBlockchainId(__destination_chain_id));
        // query balances
        queryBalances(t1, t2);
    }

    const queryBalances = (t1: any, t2: any) => {
        if (address === undefined) {
            return;
        }
        // query balances
        Promise.all([
            getBalance(t1.chain_id, t1.address, address),
            getBalance(t2.chain_id, t2.address, address),
        ]).then((r: any) => {
            setInput({ ...t1, balance: getNormalizedBN(r[0], t1.decimals) });
            setDestination({ ...t2, balance: getNormalizedBN(r[1], t2.decimals) });
        });
    }

    const onInputChange = (token: any) => {
        const { chain_id } = token;
        setTransactionData(undefined);
        setTransactionStatus(undefined);
        updateTokens(token.address, chain_id);
    }

    useEffect(() => {
        if (status === "connecting") {
            return;
        }
        if (address === undefined) {
            setMounted(false);
            return;
        }
        setMounted(true);
    }, [status, address]);

    const onInputAmountChange = async (value: any) => {
        if (["", "-", "."].indexOf(value) > -1) {
            setTransactionData(undefined);
            return;
        }
        if (address === undefined) {
            return;
        }
        setInput({ ...input, value: value });
        let bn = new BigNumber(value);
        if (bn.isZero() || destinationBlockchainId === undefined) {
            setTransactionData(undefined);
            return;
        }
        // create transactions
        let transactions = [];
        const home_transferer = input.is_transferer === true ? input.address : input.transferer;
        // TODO: use this variable
        let func = input.address === "native" ? sendNative : send;
        let data: any = func(home_transferer, destinationBlockchainId,
            destination.transferer, address, input.address, bn, destination.decimals, isMultiHop);
        data.gas = 500000;
        // check allowance
        if (input.address !== "native") {
            let allowance = await getAllowance(sourceChainId, input.address, address, home_transferer);
            let allowance_normalized = new BigNumber(allowance).div(10 ** input.decimals);
            if (bn.gt(allowance_normalized)) {
                const data = approve(input.address, home_transferer, new BigNumber(value), input.decimals);
                transactions.push({ title: "Approve", description: `Approve ${bn.toFixed(3)} ${input.symbol}`, data: data });
            }
        }
        transactions.push({ title: "Transfer", description: `Transfer ${bn.toFixed(3)} ${input.symbol}`, data: data });
        setTransactionData(transactions);
        setTransactionStatus(undefined);
    }

    const onTransactionSent = (time: any) => {
        setTransactionStatus({ sent: true, sent_at: time });
    }

    const onDestinationChainChange = (chain_id: number) => {
        setTransactionData(undefined);
        setTransactionStatus(undefined);
        updateTokens(input.address, sourceChainId, chain_id);
    }

    const onTransactionConfirmed = async (receipt: any) => {
        if (receipt === undefined) {
            setTransactionStatus((prev_state: any) => ({ ...prev_state, failed: true }));
            return;
        }
        const { logs, blockNumber } = receipt;
        const messenger: any = sourceInterchainMessenger;
        let log = logs.find((l: any) => l.address.toLowerCase() === messenger.toLowerCase());
        await getBlock(sourceChainId, blockNumber).then((r: any) => {
            const { timestamp } = r;
            let time = new Date((timestamp + 1) * 1000).getTime();
            setTransactionStatus((prev_state: any) => ({ 
                ...prev_state, 
                confirmed: true, 
                confirmed_at: time, 
            }));
        });
        const message_id = getMessageId(log);
        setMessageId(message_id);
        setTryCount(0);
        queryBalances(input, destination);
    }

    useEffect(() => {
        if (messageId === undefined) {
            return;
        }
        isMessageReceived(messageId).then(r => {
            if (r === true) {
                queryBalances(input, destination);
                return;
            }
            // try after 200 milliseconds
            setTimeout(() => {
                setTryCount((prev) => prev + 1);
            }, 200);
        });
    }, [messageId, tryCount]);

    useEffect(() => {
        if (homeMessageId === undefined) {
            return;
        }
        isMessageReceived(homeMessageId).then(r => {
            if (r === true) {
                queryBalances(input, destination);
                return;
            }
            // try after 200 milliseconds
            setTimeout(() => {
                setHomeMessageTryCount((prev) => prev + 1);
            }, 200);
        });
    }, [homeMessageId, homeMessageTryCount]);

    const isMessageReceived = async (messageId: string) => {
        const check_home = isMultiHop && transactionStatus.home_received !== true;
        const chain_id = check_home === true ? home.chain_id : destinationChainId;
        const log = await getReceiveTransaction(chain_id, messageId);
        if (log === undefined) {
            return false;
        }
        if (check_home === true) {
            const hash = log.transactionHash;
            setHomeMessageId(await getHomeHopMessageId(home.chain_id, hash));
        }
        const block = await getBlock(chain_id, log.blockNumber);
        if (block === null) {
            return false;
        }
        const { timestamp } = block;
        let time = new Date((timestamp + 1) * 1000).getTime();
        setTransactionStatus((prev_state: any) => ({
            ...prev_state, 
            [check_home ? "home_received" : "received"]: true, 
            [check_home ? "home_received_at" : "received_at"]: time, 
        }));
        return true;
    }

    const destination_selection = useMemo(() => {
        if (destination === undefined) {
            return;
        }
        return <Container className="flex flex-col w-full justify-between gap-2 text-sm">
            <div className="flex justify-between">
                {/* Selected Token Balance */}
                <span className="text-xs">Destination</span>
                {
                    mounted && <div className="flex gap-1 text-xs">
                        <span>Balance:</span>
                        {destination.balance?.toFixed(3, BigNumber.ROUND_DOWN) || <Spinner></Spinner>}
                    </div>
                }
            </div>
            <div className="flex w-full items-center justify-between gap-2 text-sm rounded-md">
                <ChainDropdown list={chainOptions} selected={destinationChainId} onSelectionChanged={onDestinationChainChange}></ChainDropdown>
            </div>
        </Container>
    }, [destination]);

    return <div className="flex w-full justify-center items-center">
        <Container className="w-[400px] flex flex-col gap-4 border-0 shadow-lg">

            {/* Header */}
            <div className="w-full flex items-center justify-between">
                <h1 className="font-semibold">Interchain Token Transfer</h1>
                <div className="flex items-center gap-2">
                    <ConnectStatusIndicator></ConnectStatusIndicator>
                    <ConnectButton showConnectedWallet={true} className="bg-primary text-primary-foreground p-2 rounded-md text-xs"></ConnectButton>
                </div>
            </div>
            <hr />

            {/* Token In & Source */}
            {input && <div id="input" className="flex flex-col w-full justify-between gap-2 text-sm rounded-md">
                <div className="flex justify-between">
                    {/* Selected Token Balance */}
                    <span className="text-xs">Source</span>
                    {
                        mounted && <div className="flex gap-1 text-xs">
                            <span>Balance:</span>
                            {input.balance?.toFixed(3, BigNumber.ROUND_DOWN) || <Spinner></Spinner>}
                        </div>
                    }
                </div>
                <div className="flex w-full items-center justify-between gap-2 text-sm bg-primary border border-input rounded-md">
                    {/* Amount Input */}
                    <AmountInput className='w-[200px]' type="text" disabled={false}
                        value={input.value} placeholder='0' onChange={onInputAmountChange}></AmountInput>
                    {/* Seperator */}
                    <div className="flex h-[100%] w-[1px] bg-gray-300">&nbsp;</div>
                    {/* Token Input */}
                    <MultiChainTokenInput className="p-2 rounded-md min-w-max"
                        list={list.filter(t => t.supports_ictt === true)} selected={input}
                        onSelectionChanged={onInputChange} showBalances={true}>
                    </MultiChainTokenInput>
                </div>
            </div>}

            {/* Destination */}
            { destination_selection }

            {/* Execute Transaction Button */}
            <TransactionManager chain_id={sourceChainId} transactions={transactionData} onTransactionConfirmed={onTransactionConfirmed}
                onTransactionSent={onTransactionSent} className="p-2 text-white rounded-md"></TransactionManager>

            {/* Show Transaction Status */}
            {
                (transactionStatus && transactionStatus.sent === true && transactionStatus.failed !== true) && <Container className="w-full flex justify-center bg-primary text-sm rounded-md p-0 px-2 border-0">
                    <div className="flex w-full items-center justify-between p-2">
                        <span>UI</span>
                        {
                            transactionStatus.confirmed === true ?
                                <div className="text-xs flex flex-col items-center gap-2">
                                    {"<" + (transactionStatus.confirmed_at - transactionStatus.sent_at)} ms
                                </div> : <Ellipsis className="animate-pulse" color="black" />
                        }
                        <ChainIcon chain_id={sourceChainId}></ChainIcon>
                        {
                            (isMultiHop === true) && (transactionStatus.home_received === true ?
                                <div className="text-xs flex flex-col items-center gap-2">
                                    {"<" + (transactionStatus.home_received_at - transactionStatus.confirmed_at)} ms
                                </div> : <Ellipsis className="animate-pulse" color="black" />)
                        }
                        {
                            (isMultiHop === true) && <ChainIcon chain_id={home.chain_id}></ChainIcon>
                        }
                        {
                            transactionStatus.received === true ?
                                <div className="text-xs flex flex-col items-center gap-2">
                                    {"<" + (transactionStatus.received_at - (isMultiHop === true ? transactionStatus.home_received_at : transactionStatus.confirmed_at))} ms
                                </div> : <Ellipsis className="animate-pulse" color="black" />
                        }
                        <ChainIcon chain_id={destinationChainId}></ChainIcon>
                    </div>
                </Container>
            }

        </Container>
    </div>

}