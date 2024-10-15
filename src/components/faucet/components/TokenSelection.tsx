import React from "react";
import { Component } from "../../common/types";
import { useFaucetContext } from "./Provider";
import { Spinner } from "../../../components/common";
import { TokenInput } from "../../../components/input";

import { BigNumber } from "bignumber.js";
import { createAlert } from "../../../components/common/utils/ui.utils";
import { CircleX } from "lucide-react";

export const TokenSelection: React.FC<Component> = (props) => {
    const {
        isLoading,
        faucet,
        selectableTokens,
        selectedToken, setSelectedToken
    } = useFaucetContext();


    const onTokenChanged = (token: any) => {
        const asset = faucet.assets.find((a: any) => a.address.toLowerCase() === token.address.toLowerCase());
        token.drip_amount = asset.drip_amount;
        setSelectedToken(token);
    }

    return (isLoading === false) && (selectedToken === undefined ? createAlert("destructive", <CircleX></CircleX>, "Sorry!", "There are no available tokens to distribute on the selected network.") :
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
                    chain_id={selectedToken.chain_id} onSelectionChanged={onTokenChanged} showBalances={false}></TokenInput>
            </div>
        </div>)
};
