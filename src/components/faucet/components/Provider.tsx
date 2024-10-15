import React, { createContext, useContext, useEffect, useState } from "react";
import { Context, FaucetProps } from "../types";
import { useFaucet } from "../hooks/useFaucet";
import { useTokens } from "../../../components/tokens";
import { TokenItem } from "../../../components/tokens/types";
import { getNormalizedBN } from "../../../components/common";
import { useValue } from "../../../components/common/utils/common.utils";

const context = {} as Context;
export const FaucetContext = createContext<Context>(context);
export function useFaucetContext() {
    return useContext(FaucetContext);
}

export const Provider: React.FC<FaucetProps> = (props) => {
    const { tokens, children } = props;

    const { getConfig } = useFaucet();
    const { data, isLoading } = getConfig();

    const [ chains, setChains ] = useState<any[]>([]);

    const [ selectedChain, setSelectedChain ] = useState<number>();
    const [ faucet, setFaucet ] = useState<any>(undefined);
    const [ selectableTokens, setSelectableTokens ] = useState<TokenItem[]>([]);
    const [ selectedToken, setSelectedToken ] = useState<TokenItem>();

    const [ address, setAddress ] = useState<any>();

    const { getBalance } = useTokens();

    useEffect(() => {
        if (data?.data === undefined) {
            return;
        }
        const { data: result } = data;
        const chains = result.chains;
        if (chains.length === 0) {
            return;
        }
        const selected = result.chains[0];
        if (selected === null) {
            return;
        }
        let selectable_tokens = tokens.filter(t => 
            t.chain_id === selected.id && selected.faucet.assets.find((a: any) => a.address.toLowerCase() === t.address.toLowerCase()) !== undefined
        );
        setSelectableTokens(selectable_tokens);
        if (selectable_tokens.length > 0) {
            const selected_token = selectable_tokens[0];
            const asset = selected.faucet.assets.find((a: any) => a.address.toLowerCase() === selected_token.address.toLowerCase());
            selected_token.drip_amount = asset.drip_amount;
            setSelectedToken(selected_token);
        }
        setSelectedChain(selected.id);
        setFaucet(selected.faucet);
        setChains(chains);
    }, [data]);

    useEffect(() => {
        if (selectedChain === undefined || selectedToken === undefined || faucet === undefined) {
            return;
        }
        // fetch faucet balance
        getBalance(selectedChain, selectedToken.address, faucet.address).then(r => {
            setFaucet((prev_state: any) => ({ ...prev_state, balance: getNormalizedBN(r, selectedToken.decimals) }));
        });
    }, [selectedToken]);

    const onAddressChange = (address: string) => {
        setAddress(address === "" ? undefined : address);
    }

    const isFormValid = () => {
        return (address !== undefined && selectedToken !== undefined);
    }

    const [ buttonStatus, setButtonStatus ] = useState<"idle" | "disabled" | "loading">("idle");
    const [ error, setError ] = useState(undefined);

    // Context manager

    const value = useValue({
        isLoading,
        chains,
        faucet,
        selectedChain,
        selectableTokens,
        selectedToken, setSelectedToken,
        address, onAddressChange,
        isFormValid,
        buttonStatus, setButtonStatus,
        error, setError
    });

    return <FaucetContext.Provider value={value}>
        { children }
    </FaucetContext.Provider>

};
