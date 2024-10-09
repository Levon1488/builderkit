import { Component } from "../common/types";

export type CollectibleProps = {
    address: string;
    chain_id: number;
    token_id: number;
} & Component;