import React from "react";
import { Component } from "../../common/types";
import { useFaucetContext } from "./Provider";
import { AddressInput } from "../../../components/input";

export const ReceiverInput: React.FC<Component> = (props) => {
    const {
        selectedToken,
        onAddressChange
    } = useFaucetContext();

    return selectedToken && <div id="receiver" className="flex flex-col w-full justify-between gap-2 text-sm rounded-md">
        {/* Selected Token Balance */}
        <div className="flex justify-between">
            <span className="text-xs">Receiver Address</span>
        </div>
        <div className="text-sm rounded-md bg-primary border border-input">
            <AddressInput type="text" placeholder="Enter 0x.. address" onChange={onAddressChange}></AddressInput>
        </div>
    </div>

};
