import React from "react";
import { Component } from "../../common/types";
import { useFaucetContext } from "./Provider";
import { ChainDropdown } from "../../../components/chains";
import { LoadingIndicator } from "../../../components/common";

export const NetworkSelection: React.FC<Component> = (props) => {
    const {
        isLoading,
        chains
    } = useFaucetContext();

    return (isLoading === true) ? <LoadingIndicator></LoadingIndicator> : (isLoading === false && chains && chains.length > 0) && <div id="network" className="flex flex-col w-full justify-between gap-2 text-smd">
        <span className="text-xs">Network</span>
        <div className="flex w-full items-center justify-between gap-2 text-sm rounded-md">
            <ChainDropdown list={chains.map((c: any) => c.id)} selected={chains[0].id} onSelectionChanged={() => { /* TODO: */ }}></ChainDropdown>
        </div>
    </div>

};
