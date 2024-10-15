import React from "react";
import { BigNumber } from "bignumber.js";
import { Container, Spinner } from "../../common";
import { Component } from "../../common/types";
import { ChainDropdown } from "../../chains";
import { useICTTContext } from "./Provider";

export const Destination: React.FC<Component> = (props) => {
    const {
        mounted,
        chainOptions,
        destination, destinationChainId,
        onDestinationChainChange
    } = useICTTContext();


    return destination && <Container className="flex flex-col w-full justify-between gap-2 text-sm">
        <div className="flex justify-between">
            {/* Selected Token Balance */}
            <span className="text-xs">Destination</span>
            {
                mounted && <div className="flex gap-1 text-xs">
                    <span>Balance:</span>
                    {destination.balance?.toFixed(3, BigNumber.ROUND_DOWN) || <Spinner></Spinner>}
                </div>
            }
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-sm rounded-md">
            <ChainDropdown list={chainOptions} selected={destinationChainId} onSelectionChanged={onDestinationChainChange}></ChainDropdown>
        </div>
    </Container>

};
