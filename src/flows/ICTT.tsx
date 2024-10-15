
import React from "react";

import { Container } from "../components/common";

import { Input } from "../components/ictt/components/Input";
import { Header } from "../components/ictt/components/Header";
import { Destination } from "../components/ictt/components/Destination";
import { Provider } from "../components/ictt/components/Provider";
import { Action } from "../components/ictt/components/Action";
import { Status } from "../components/ictt/components/Status";
import { ICTTProps } from "../components/ictt/types";

export const ICTT: React.FC<ICTTProps> = (props) => {
    const { tokens, token_in, source_chain_id, destination_chain_id } = props;

    return <Provider tokens={tokens} token_in={token_in} source_chain_id={source_chain_id} destination_chain_id={destination_chain_id}>
        <Container className="w-[400px] flex flex-col gap-4 border-0 shadow-lg">
            <Header></Header>
            <hr />
            <Input></Input>
            <Destination></Destination>
            <Action></Action>
            <Status></Status>
        </Container>
    </Provider>

}