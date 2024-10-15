import React, { useEffect, useState } from "react";
import { Component } from "../../common/types";
import { TransactionManager } from "../../../components/transaction";
import { useICTTContext } from "./Provider";
import { useChains } from "../../../components/common";
import { useICTT } from "../hooks/useICTT";

export const Action: React.FC<Component> = (props) => {
    const {
        input,
        sourceChainId,
        sourceInterchainMessenger,
        destination, destinationChainId,
        queryBalances,
        isMultiHop, home,
        transactionData,
        transactionStatus, setTransactionStatus
    } = useICTTContext();

    const { getMessageId, getReceiveTransaction, getHomeHopMessageId } = useICTT();

    // Transaction state handlers

    const { getBlock } = useChains();

    const [ messageId, setMessageId] = useState<any>(undefined);
    const [ tryCount, setTryCount] = useState(0);

    const [ homeMessageId, setHomeMessageId ] = useState<any>(undefined);
    const [ homeMessageTryCount, setHomeMessageTryCount ] = useState(0);

    const onTransactionSent = (time: any) => {
        setTransactionStatus({ sent: true, sent_at: time });
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

    return <TransactionManager chain_id={sourceChainId} transactions={transactionData} onTransactionConfirmed={onTransactionConfirmed}
        onTransactionSent={onTransactionSent} className="p-2 text-white rounded-md"></TransactionManager>

};
