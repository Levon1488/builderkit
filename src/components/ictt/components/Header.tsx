import React from "react";
import { Component } from "../../common/types";
import { ConnectStatusIndicator } from "../../../components/wallet";
import { ConnectButton } from "../../../components/control";

export const Header: React.FC<Component> = (props) => {

    return <div className="w-full flex items-center justify-between">
        <h1 className="font-semibold">Interchain Token Transfer</h1>
        <div className="flex items-center gap-2">
            <ConnectStatusIndicator></ConnectStatusIndicator>
            <ConnectButton showConnectedWallet={true} className="bg-primary text-primary-foreground p-2 rounded-md text-xs"></ConnectButton>
        </div>
    </div>

};
