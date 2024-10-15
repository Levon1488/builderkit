import { ContainerProps } from "../common/types";
import { TokenItem } from "../tokens/types";

export type ICTTProps = {
    tokens: TokenItem[];
    token_in: string;
    source_chain_id: number;
    destination_chain_id: number;
} & ContainerProps;

export type Context = {
    list: TokenItem[],
    address: `0x${string}` | undefined,
    mounted: boolean,
    input: TokenItem, setInput: (token: TokenItem) => void,
    onInputChange: (token: TokenItem) => void,
    sourceChainId: number,
    setSourceChainId: (chain_id: number) => void,
    sourceInterchainMessenger: any,
    chainOptions: number[],
    destination: TokenItem,
    destinationChainId: number,
    destinationBlockchainId: string,
    onDestinationChainChange: (chain_id: number) => void,
    queryBalances: (token1: TokenItem, token2: TokenItem) => any,
    isMultiHop: boolean,
    home: TokenItem,
    transactionData: any, setTransactionData: (data: any) => void,
    transactionStatus: any, setTransactionStatus: (status: any) => void
};