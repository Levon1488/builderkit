import { ContainerProps } from "../common/types";
import { TokenItem } from "../tokens/types";

export type FaucetProps = {
    tokens: TokenItem[];
} & ContainerProps;

export type Context = {
    isLoading: boolean,
    chains: any[],
    selectedChain: number | undefined,
    faucet: any,
    selectableTokens: TokenItem[],
    selectedToken: TokenItem | undefined, setSelectedToken: (token: TokenItem) => void,
    address: string, onAddressChange: (address: string) => void,
    isFormValid: () => boolean,
    buttonStatus: "idle" | "disabled" | "loading",
    setButtonStatus: (status: "idle" | "disabled" | "loading") => void,
    error: any, setError: (error: any) => void
};