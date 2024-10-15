import React, { createContext, useContext, useEffect, useState } from "react";
import { TokenItem } from "../../../components/tokens/types";
import { useAccount } from "wagmi";
import { useTokens } from "../../../components/tokens";
import { getNormalizedBN } from "../../../components/common";
import { useWarpMessenger } from "../../../components/precompiles";
import { useICTT } from "../hooks/useICTT";
import { useValue } from "../../../components/common/utils/ui.utils";

export type ICTTContextType = {
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

const context = {} as ICTTContextType;
export const ICTTContext = createContext<ICTTContextType>(context);
export function useICTTContext() {
    return useContext(ICTTContext);
}

interface ICTTProps {
    tokens: TokenItem[];
    token_in: string;
    source_chain_id: number;
    destination_chain_id: number;
    children: any;
    className?: string;
}

export const Provider: React.FC<ICTTProps> = (props) => {
    const { tokens, token_in, source_chain_id, destination_chain_id, children } = props;

    const [ list, setList ] = useState(tokens);
    const [ input, setInput ] = useState<any>(undefined);
    const [ sourceChainId, setSourceChainId ] = useState(source_chain_id);
    const [ sourceInterchainMessenger, setSourceInterchainMessenger ] = useState(undefined);
    const [ destinationChainId, setDestinationChainId ] = useState(destination_chain_id);

    const [ chainOptions, setChainOptions ] = useState<number[]>([]);
    const [ destination, setDestination ] = useState<any>(undefined);
    const [ destinationBlockchainId, setDestinationBlockchainId ] = useState<any>(undefined);

    const [ isMultiHop, setMultiHop ] = useState(false);
    const [ home, setHome ] = useState<any>(undefined);

    const { getInterchainMessenger } = useICTT();
    const { getBlockchainId } = useWarpMessenger();

    const { getBalance } = useTokens();

    const [ transactionStatus, setTransactionStatus ] = useState<any>(undefined);
    const [ transactionData, setTransactionData ] = useState<any>(undefined);

    const queryBalances = (t1: TokenItem, t2: TokenItem) => {
        if (address === undefined) {
            return;
        }
        // query balances
        Promise.all([
            getBalance(t1.chain_id, t1.address, address),
            getBalance(t2.chain_id, t2.address, address),
        ]).then((r: any) => {
            setInput({ ...t1, balance: getNormalizedBN(r[0], t1.decimals) });
            setDestination({ ...t2, balance: getNormalizedBN(r[1], t2.decimals) });
        });
    }

    const updateTokens = async (token_in: string, _source_chain_id: number, _destination_chain_id?: number) => {
        if (token_in === undefined) {
            return;
        }
        // set tokens
        const t1 = tokens.find(t => t.address === token_in && t.chain_id === _source_chain_id);
        if (t1 === undefined) {
            return;
        }
        setSourceChainId(_source_chain_id);
        setInput(t1);
        setSourceInterchainMessenger(await getInterchainMessenger(_source_chain_id));
        // find chain options
        let __destination_chain_id: any = _destination_chain_id;
        if (t1.supports_ictt === true) {
            const options = t1.mirrors.map((m: any) => m.chain_id);
            setChainOptions(options);
            __destination_chain_id = _destination_chain_id || options[0];
            setDestinationChainId(__destination_chain_id);
        }
        // find destination
        let t2 = t1.mirrors.find((m: any) => m.chain_id === __destination_chain_id);
        if (t2 === undefined) {
            return;
        }
        setDestination(t2);
        // Check is multi-hop transaction
        const is_multi_hop = t1.is_transferer === true && t2.address === t2.transferer;
        let home = t1.mirrors.find((m: any) => m.home === true);
        setHome(home);
        setMultiHop(is_multi_hop);
        // get destination blockchain id
        setDestinationBlockchainId(await getBlockchainId(__destination_chain_id));
        // query balances
        queryBalances(t1, t2);
    }

    useEffect(() => {
        updateTokens(token_in, source_chain_id, destination_chain_id);
    }, [token_in, source_chain_id, destination_chain_id]);

    const { address, status } = useAccount();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        if (status === "connecting") {
            return;
        }
        if (address === undefined) {
            setMounted(false);
            return;
        }
        setMounted(true);
    }, [status, address]);

    // Event handlers

    const onInputChange = (token: any) => {
        const { chain_id } = token;
        setTransactionData(undefined);
        setTransactionStatus(undefined);
        updateTokens(token.address, chain_id);
    }

    const onDestinationChainChange = (chain_id: number) => {
        setTransactionData(undefined);
        setTransactionStatus(undefined);
        updateTokens(input.address, sourceChainId, chain_id);
    }

    // Context manager

    const value = useValue({
        list,
        address, mounted,
        input, setInput,
        onInputChange,
        sourceChainId, setSourceChainId,
        sourceInterchainMessenger,
        chainOptions,
        destination, destinationChainId,
        destinationBlockchainId,
        onDestinationChainChange,
        queryBalances,
        isMultiHop, home,
        transactionData, setTransactionData,
        transactionStatus, setTransactionStatus
    });

    return <ICTTContext.Provider value={value}>
        { children }
    </ICTTContext.Provider>

};
