import React from "react";
import { Component } from "../../common/types";
import { createAlert } from "../../../components/common/utils/ui.utils";
import { Info } from "lucide-react";
import { useFaucetContext } from "./Provider";

export const TestFundsMessage: React.FC<Component> = (props) => {
    const {
        isLoading,
        selectedToken
    } = useFaucetContext();

    return (isLoading === false && selectedToken !== undefined) && createAlert("info", <Info></Info>, "This is a Testnet Faucet", "Funds are not real.");

};
