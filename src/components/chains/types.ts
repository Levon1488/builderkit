import { Component } from "../common/types";

export type ChainItem = {
    chain_id: number;
    name: string;
    [key: string]: any;
}

export type ChainDropdownProps = {
    selected: number,
    list: number[]
    onSelectionChanged?: (chain_id: number) => void;
} & Component;

export type ChainIconProps = { chain_id: number; } & Component;

export type ChainRowProps = ChainItem & Component;