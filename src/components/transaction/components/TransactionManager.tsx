import React, { useEffect, useMemo, useState } from 'react';
import { TransactionButton } from './TransactionButton';
import { TransactionManagerProps } from '../types';

export const TransactionManager: React.FC<TransactionManagerProps> = (props) => {
    const { transactions, chain_id, onTransactionConfirmed, onTransactionSent, className } = props;

    const [ step, setStep ] = useState<number>(0);

    const onStepSent = (t: number) => {
        let _step = step + 1;
        if (_step === transactions.length) {
            onTransactionSent(t);
        }
    }

    const onStepCompleted = (receipt: any) => {
        let _step = step + 1;
        if (_step === transactions.length) {
            onTransactionConfirmed(receipt);
        }
        setStep(_step);
    }

    useEffect(() => {
        setStep(0);
    }, [transactions]);

    let transaction = useMemo(() => {
        if (transactions === undefined || step === undefined) {
            return <TransactionButton chain_id={chain_id} title={undefined} className={className}></TransactionButton>;
        } else if (step === transactions.length) {
            return <TransactionButton chain_id={chain_id} title={"Success!"} className={className}></TransactionButton>;
        }
        return <TransactionButton chain_id={chain_id} title={transactions[step].title} description={transactions[step].description}
            data={transactions[step].data} onTransactionConfirmed={onStepCompleted} onTransactionSent={onStepSent} className={className}>
        </TransactionButton>
    }, [chain_id, transactions, step]);

    return (<>{ transaction }</>);

};
