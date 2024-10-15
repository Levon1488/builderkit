import { Component } from "../common/types";
import { TokenItem } from "../tokens/types";

export type ICTTProps = {
    tokens: TokenItem[];
    token_in: string;
    source_chain_id: number;
    destination_chain_id: number;
} & Component;