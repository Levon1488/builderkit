
import React from "react";

import { Container } from "../components/common";
import { TokenItem } from "../components/tokens/types";
import { NetworkSelection } from "../components/faucet/components/NetworkSelection";
import { Provider } from "../components/faucet/components/Provider";
import { ReceiverInput } from "../components/faucet/components/ReceiverInput";
import { Action } from "../components/faucet/components/Action";
import { TokenSelection } from "../components/faucet/components/TokenSelection";
import { Header } from "../components/faucet/components/Header";
import { ErrorMessage } from "../components/faucet/components/ErrorMessage";
import { TestFundsMessage } from "../components/faucet/components/TestFundsMessage";

interface FaucetProps {
    tokens: TokenItem[];
    className?: string;
}

export const Faucet: React.FC<FaucetProps> = (props) => {
    const { tokens } = props;

    return <Provider tokens={tokens}>
        <Container className="w-[400px] flex flex-col gap-4 border-0 shadow-lg">
            <Header></Header>
            <hr />
            <NetworkSelection></NetworkSelection>
            <TokenSelection></TokenSelection>
            <ReceiverInput></ReceiverInput>
            <TestFundsMessage></TestFundsMessage>
            <Action></Action>
            <ErrorMessage></ErrorMessage>
        </Container>
    </Provider>

}