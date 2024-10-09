import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../common/components/Select";
import { useChains } from "../../common";
import { ChainRow } from "./ChainRow";
import { ChainDropdownProps } from "../types";

export const ChainDropdown: React.FC<ChainDropdownProps> = (props) => {
    const { selected, list, onSelectionChanged, className } = props;

    const [ selectedId, setSelectedId ] = useState(selected);
    const { getChains } = useChains();

    useEffect(() => {
        setSelectedId(selected);
    }, [selected])

    return (<Select value={selectedId.toString()} onValueChange={(value) => {
        if (onSelectionChanged === undefined) {
            return;
        }
        const chain_id = parseInt(value);
        setSelectedId(chain_id);
        onSelectionChanged(chain_id);
    }}>
        <SelectTrigger className="w-full bg-primary text-primary-foreground p-2 rounded-md">
            <SelectValue placeholder="Select a chain" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {
                    list.map(c => {
                        let chain = getChains().find(cc => cc.id === c);
                        if (chain === undefined) {
                            return;
                        }
                        return <SelectItem key={chain.id} value={chain.id.toString()} className="cursor-pointer">
                            <ChainRow chain_id={chain.id} name={chain.name}></ChainRow>
                        </SelectItem>
                    })
                }
            </SelectGroup>
        </SelectContent>
    </Select>);

};
