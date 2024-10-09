import React, { useEffect, useState } from 'react';
import { useAccount, useChains, useSendTransaction, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '../../control';
import { useAddRecentTransaction, useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '../../../utils/cn';
import { LoadingIndicator } from '../../common';
import { toast } from 'sonner';
import { TransactionButtonProps } from '../types';

export const TransactionButton: React.FC<TransactionButtonProps> = (props) => {
    const { chain_id, title, data, description, onTransactionConfirmed, onTransactionSent, className } = props;

    const [mounted, setMounted] = useState(false);
    const { address, chain, status } = useAccount();

    const { data: hash, error, isPending, sendTransaction, reset } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed, failureReason, data: receipt } =
        useWaitForTransactionReceipt({
            hash,
            query: { enabled: hash !== undefined }
        });

    const addRecentTransaction = useAddRecentTransaction();
    const chains = useChains();

    useEffect(() => {
        if (status !== "connecting") {
            setMounted(true);
        }
    }, [status]);

    useEffect(() => {
        reset();
    }, [chain, data]);

    const { openConnectModal } = useConnectModal();
    const { switchChain } = useSwitchChain();

    const ConnectButton = <Button className={cn(className, "bg-red-600")}
        label="Connect Wallet"
        action={() => {
            if (openConnectModal === undefined) {
                return;
            }
            openConnectModal();
        }}></Button>;
    const WrongNetworkButton = <Button className={cn(className, "bg-red-600")}
        label="Wrong Network"
        action={() => {
            if (switchChain === undefined) {
                return;
            }
            switchChain({ chainId: chain_id });
        }}></Button>;
    const TransactButton = <Button className={cn(className, data === undefined ? "bg-gray-600 cursor-not-allowed" : "bg-green-600")}
        label={title || "No Data"}
        action={() => {
            if (data === undefined || isPending === true || isConfirming === true) {
                return;
            }
            sendTransaction({ ...data, chainId: chain_id });
        }}></Button>

    useEffect(() => {
        if (hash === undefined) {
            return;
        }
        // trigger send event
        if (onTransactionSent !== undefined) {
            onTransactionSent(new Date().getTime());
        }
        const chain = chains.find(c => c.id === chain_id);
        const explorer_url = chain?.blockExplorers?.default.url;
        toast("Transaction has been sent!", {
            description: new Date().toLocaleString(),
            action: {
                label: "View",
                onClick: () => window.open(`${explorer_url}/tx/${hash}`, '_blank', 'noopener,noreferrer'),
            },
            classNames: {
                toast: "!bg-yellow-700 !text-white border-0",
                description: " !text-white opacity-50 text-xs"
            }
        });
        // add to recent transaction
        if (description === undefined) {
            return;
        }
        addRecentTransaction({ hash, description });
    }, [hash]);

    useEffect(() => {
        if (isConfirmed === undefined || hash === undefined) {
            return;
        }
        const chain = chains.find(c => c.id === chain_id);
        const explorer_url = chain?.blockExplorers?.default.url;
        toast("Transaction has been confirmed!", {
            description: new Date().toLocaleString(),
            action: {
                label: "View",
                onClick: () => window.open(`${explorer_url}/tx/${hash}`, '_blank', 'noopener,noreferrer'),
            },
            classNames: {
                toast: "!bg-green-900 !text-white border-0",
                description: " !text-white opacity-50 text-xs"
            }
        });
        // trigger confirmed event
        if (onTransactionConfirmed !== undefined) {
            onTransactionConfirmed(receipt);
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (failureReason === undefined || hash === undefined) {
            return;
        }
        const chain = chains.find(c => c.id === chain_id);
        const explorer_url = chain?.blockExplorers?.default.url;
        toast("Transaction has been failed!", {
            description: new Date().toLocaleString(),
            action: {
                label: "View",
                onClick: () => window.open(`${explorer_url}/tx/${hash}`, '_blank', 'noopener,noreferrer'),
            },
            classNames: {
                toast: "!bg-red-900 !text-white border-0",
                description: " !text-white opacity-50 text-xs"
            }
        });
        // trigger confirmed event
        if (onTransactionConfirmed !== undefined) {
            onTransactionConfirmed(undefined);
        }
    }, [failureReason]);

    return (<>
        {
            (
                mounted === true ?
                    (address === undefined ? ConnectButton :
                        chain === undefined || chain_id !== chain.id ?
                            WrongNetworkButton : isPending === false && isConfirming === false ? TransactButton :
                                <LoadingIndicator className={cn("bg-green-600", className)}></LoadingIndicator>) :
                    <LoadingIndicator className={cn("bg-gray-600 cursor-not-allowed", className)}></LoadingIndicator>
            )
        }
        {
            (error && (
                <div className='text-xs break-all italic text-center'>Error: {error.message}</div>
            ))
        }
    </>)

};
