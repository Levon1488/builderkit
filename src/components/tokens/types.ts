import { BigNumber } from "bignumber.js";
import { Component } from "../common/types";

export type TokenItem = {
    chain_id: number;
    address: string;
    name: string;
    symbol: string;
    [key: string]: any;
}

export type TokenChipProps = { chain_id: number, address: string, symbol: string } & Partial<TokenItem> & {
    allowCopyToClipboard?: boolean;
    showChainIcon?: boolean;
    showName?: boolean;
} & Component;

export type TokenIconProps = { address: string; } & Component;
export type TokenIconWithChainProps = TokenIconProps & { chain_id: number; };

export type TokenListProps = {
    selected?: { address: string } & Partial<TokenItem>;
    chain_id: number;
    list: TokenItem[];
    onClick: (address: string) => void;
    showBalances: boolean;
} & Component;

export type TokenRowProps = TokenItem & {
    balance?: BigNumber;
    onClick?: any;
} & Component;