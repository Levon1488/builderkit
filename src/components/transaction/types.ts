import { Component } from "../common/types";

export type TransactionProps = {
    title: string;
    description: string;
    data: any;
}

export type TransactionButtonProps = Partial<TransactionProps> & {
    chain_id: number;
    onTransactionConfirmed?: any;
    onTransactionSent?: any;
} & Component;

export type TransactionManagerProps = {
    transactions: TransactionProps[];
    chain_id: number;
    onTransactionConfirmed?: any;
    onTransactionSent?: any;
} & Component;