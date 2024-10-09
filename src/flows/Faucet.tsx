
import React from "react";
import { useEffect, useState } from "react";

import { BigNumber } from "bignumber.js";
import { CircleX, Info } from "lucide-react";
import { Container, getNormalizedBN, LoadingIndicator, Spinner } from "../components/common";
import { useTokens } from "../components/tokens";
import { Button } from "../components/control";
import { TokenInput, AddressInput } from "../components/input";
import { ChainDropdown } from "../components/chains";
import { TokenItem } from "../components/tokens/types";
import { Alert, AlertDescription, AlertTitle } from "../components/common/components/Alert";
import { useFaucet } from "../components/faucet";
import axios from "axios";
import { toast } from "sonner";

interface FaucetProps {
    tokens: TokenItem[];
    className?: string;
}

export const Faucet: React.FC<FaucetProps> = (props) => {
    const { tokens } = props;

    const { getConfig } = useFaucet();
    const { data, isLoading } = getConfig();

    const [ chains, setChains ] = useState<any[]>([]);

    const [ selectedChain, setSelectedChain ] = useState<any>(undefined);
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
        if (selectedToken === undefined || faucet === undefined) {
            return;
        }
        // fetch faucet balance
        getBalance(selectedChain, selectedToken.address, faucet.address).then(r => {
            setFaucet((prev_state: any) => ({ ...prev_state, balance: getNormalizedBN(r, selectedToken.decimals) }));
        });
    }, [selectedToken]);


    const onTokenChanged = (token: any) => {
        const asset = faucet.assets.find((a: any) => a.address.toLowerCase() === token.address.toLowerCase());
        token.drip_amount = asset.drip_amount;
        setSelectedToken(token);
    }

    const onAddressChange = (address: string) => {
        setAddress(address === "" ? undefined : address);
    }

    const isFormValid = () => {
        return (address !== undefined && selectedToken !== undefined);
    }

    const [ buttonStatus, setButtonStatus ] = useState<"idle" | "disabled" | "loading">("idle");
    const [ error, setError ] = useState(undefined);

    const onRequestClicked = async () => {
        if (buttonStatus !== "idle" || isFormValid() === false || selectedToken === undefined) {
            return;
        }
        setError(undefined);
        // call send method
        setButtonStatus("loading");
        axios.post("/api/faucet/send", {
            chain_id: selectedChain,
            address: selectedToken.address,
            receiver: address
        }).then(r => {
            setButtonStatus("disabled");
            const hash = r.data.hash;
            const chain = chains.find(c => c.id === selectedChain);
            const explorer_url = chain?.blockExplorers?.default.url;
            toast("Transaction has been sent!", {
                description: new Date().toLocaleString(),
                action: {
                    label: "View",
                    onClick: () => window.open(`${explorer_url}/tx/${hash}`, '_blank', 'noopener,noreferrer'),
                },
                classNames: {
                    toast: "!bg-green-900 !text-white border-0",
                    description: " !text-white opacity-50 text-xs"
                }
            });
        }).catch((err) => {
            setButtonStatus("disabled");
            setError(err.response.data.message);
        });
    }

    return <div className="flex w-full justify-center items-center">
        <Container className="w-[400px] flex flex-col gap-4 border-0 shadow-lg">

            {/* Header */}
            <div className="w-full flex items-center justify-between">
                <h1 className="font-semibold">Faucet</h1>
            </div>
            <hr />
            {
                isLoading == true || chains.length === 0 ? <LoadingIndicator></LoadingIndicator> :
                    <div className="flex flex-col gap-4">

                        {/* Network Select Input */}
                        <div id="network" className="flex flex-col w-full justify-between gap-2 text-smd">
                            <span className="text-xs">Network</span>
                            <div className="flex w-full items-center justify-between gap-2 text-sm rounded-md">
                                <ChainDropdown list={chains.map((c: any) => c.id)} selected={chains[0].id} onSelectionChanged={() => { }}></ChainDropdown>
                            </div>
                        </div>

                        {/* Check if there're available tokens to distribute */}
                        {
                            selectedToken === undefined ?
                                <Alert variant={"destructive"}>
                                    <CircleX className="h-4 w-4" />
                                    <AlertTitle>Sorry!</AlertTitle>
                                    <AlertDescription>
                                        There are no available tokens to distribute on the selected network.
                                    </AlertDescription>
                                </Alert> :
                                <div className="flex flex-col gap-4">
                                    <div id="token" className="flex flex-col w-full justify-between gap-2 text-sm rounded-md">
                                        {/* Faucet Balance */}
                                        <div className="flex justify-between">
                                            <span className="text-xs">Token</span>
                                            {
                                                <div className="flex gap-1 text-xs">
                                                    <span>Faucet Balance:</span>
                                                    {faucet.balance?.toFixed(3, BigNumber.ROUND_DOWN) || <Spinner></Spinner>}
                                                </div>
                                            }
                                        </div>
                                        {/* Token Select Input */}
                                        <div className="flex w-full items-center justify-between gap-2 text-sm rounded-md bg-primary p-2 border border-input">
                                            <TokenInput list={selectableTokens} selected={selectedToken} 
                                                chain_id={selectedToken?.chain_id} onSelectionChanged={onTokenChanged} showBalances={false}></TokenInput>
                                        </div>
                                    </div>

                                    {/* Receiver Address */}
                                    <div id="receiver" className="flex flex-col w-full justify-between gap-2 text-sm rounded-md">
                                        {/* Selected Token Balance */}
                                        <div className="flex justify-between">
                                            <span className="text-xs">Receiver Address</span>
                                        </div>
                                        <div className="text-sm rounded-md bg-primary border border-input">
                                            <AddressInput type="text" placeholder="Enter 0x.. address" onChange={onAddressChange}></AddressInput>
                                        </div>
                                    </div>

                                    {/* Testnet funds info */}
                                    <Alert variant={"info"}>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>This is a Testnet Faucet</AlertTitle>
                                        <AlertDescription>
                                            Funds are not real.
                                        </AlertDescription>
                                    </Alert>

                                    {/* Request button */}
                                    <Button className={`bg-green-600 text-white p-2 rounded`} 
                                        label={`Request ${selectedToken.drip_amount} ${selectedToken.symbol}`} 
                                        action={onRequestClicked} status={isFormValid() ? buttonStatus : "disabled"}>
                                    </Button>

                                    {/* Show error */}
                                    { 
                                        error && <Alert variant={"destructive"}>
                                            <CircleX className="h-4 w-4" />
                                            <AlertTitle>Error!</AlertTitle>
                                            <AlertDescription>
                                                { error }
                                            </AlertDescription>
                                        </Alert> 
                                    }

                                </div>
                        }
                    </div>
            }

        </Container>
    </div>

}