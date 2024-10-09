import { Component } from "../common/types";
import { TokenItem } from "../tokens/types";

export type InputProps = {
    type: string;
    placeholder: string;
    value?: any;
    disabled?: boolean;
    icon?: any;
    onChange?: (event: any) => void;
} & Component;

export type MultiChainTokenInputProps = {
    selected: { address: string, chain_id: number } & Partial<TokenItem>;
    list: TokenItem[];
    onSelectionChanged?: (token: TokenItem) => void;
    showBalances: boolean;
} & Component;

export type TokenInputProps = {
    selected: { address: string } & Partial<TokenItem>;
    chain_id: number;
    list: TokenItem[];
    onSelectionChanged: (token: TokenItem) => void;
    showBalances: boolean;
} & Component;