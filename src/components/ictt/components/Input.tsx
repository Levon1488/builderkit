import React from "react";
import { AmountInput, MultiChainTokenInput } from "../../input";
import { BigNumber } from "bignumber.js";
import { Spinner } from "../../common";
import { useICTT } from "../hooks/useICTT";
import { useTokens } from "../../tokens";
import { Component } from "../../common/types";
import { useICTTContext } from "./Provider";

export const Input: React.FC<Component> = (props) => {
    const {
        list,
        address, mounted,
        input, setInput,
        onInputChange,
        sourceChainId,
        destination,
        destinationBlockchainId,
        isMultiHop,
        setTransactionData, setTransactionStatus
    } = useICTTContext();

    const { send, sendNative } = useICTT();
    const { getAllowance, approve } = useTokens();

    const onInputAmountChange = async (value: any) => {
        if (["", "-", "."].indexOf(value) > -1) {
            setTransactionData(undefined);
            return;
        }
        if (address === undefined) {
            return;
        }
        setInput({ ...input, value: value });
        let bn = new BigNumber(value);
        if (bn.isZero() || destinationBlockchainId === undefined) {
            setTransactionData(undefined);
            return;
        }
        // create transactions
        let transactions = [];
        const home_transferer = input.is_transferer === true ? input.address : input.transferer;
        // TODO: use this variable
        let func = input.address === "native" ? sendNative : send;
        let data: any = func(home_transferer, destinationBlockchainId,
            destination.transferer, address, input.address, bn, destination.decimals, isMultiHop);
        data.gas = 500000;
        // check allowance
        if (input.address !== "native") {
            let allowance = await getAllowance(sourceChainId, input.address, address, home_transferer);
            let allowance_normalized = new BigNumber(allowance).div(10 ** input.decimals);
            if (bn.gt(allowance_normalized)) {
                const data = approve(input.address, home_transferer, new BigNumber(value), input.decimals);
                transactions.push({ title: "Approve", description: `Approve ${bn.toFixed(3)} ${input.symbol}`, data: data });
            }
        }
        transactions.push({ title: "Transfer", description: `Transfer ${bn.toFixed(3)} ${input.symbol}`, data: data });
        setTransactionData(transactions);
        setTransactionStatus(undefined);
    }


    return input && <div id="input" className="flex flex-col w-full justify-between gap-2 text-sm rounded-md">
        <div className="flex justify-between">
            {/* Selected Token Balance */}
            <span className="text-xs">Source</span>
            {
                mounted && <div className="flex gap-1 text-xs">
                    <span>Balance:</span>
                    {input.balance?.toFixed(3, BigNumber.ROUND_DOWN) || <Spinner></Spinner>}
                </div>
            }
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-sm bg-primary border border-input rounded-md">
            {/* Amount Input */}
            <AmountInput className='w-[200px]' type="text" disabled={false}
                value={input.value} placeholder='0' onChange={onInputAmountChange}></AmountInput>
            {/* Seperator */}
            <div className="flex h-[100%] w-[1px] bg-gray-300">&nbsp;</div>
            {/* Token Input */}
            <MultiChainTokenInput className="p-2 rounded-md min-w-max"
                list={list.filter(t => t.supports_ictt === true)} selected={input}
                onSelectionChanged={onInputChange} showBalances={true}>
            </MultiChainTokenInput>
        </div>
    </div>

};
