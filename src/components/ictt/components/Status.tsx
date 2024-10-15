import React from "react";
import { Container } from "../../common";
import { Component } from "../../common/types";
import { ChainIcon } from "../../chains";
import { useICTTContext } from "./Provider";
import { Ellipsis } from "lucide-react";

export const Status: React.FC<Component> = (props) => {
    const {
        sourceChainId,
        destinationChainId,
        isMultiHop, home,
        transactionStatus

    } = useICTTContext();


    return (transactionStatus && transactionStatus.sent === true && transactionStatus.failed !== true) && <Container className="w-full flex justify-center bg-primary text-sm rounded-md p-0 px-2 border-0">
        <div className="flex w-full items-center justify-between p-2">
            <span>UI</span>
            {
                transactionStatus.confirmed === true ?
                    <div className="text-xs flex flex-col items-center gap-2">
                        {"<" + (transactionStatus.confirmed_at - transactionStatus.sent_at)} ms
                    </div> : <Ellipsis className="animate-pulse" color="black" />
            }
            <ChainIcon chain_id={sourceChainId}></ChainIcon>
            {
                (isMultiHop === true) && (transactionStatus.home_received === true ?
                    <div className="text-xs flex flex-col items-center gap-2">
                        {"<" + (transactionStatus.home_received_at - transactionStatus.confirmed_at)} ms
                    </div> : <Ellipsis className="animate-pulse" color="black" />)
            }
            {
                (isMultiHop === true) && <ChainIcon chain_id={home.chain_id}></ChainIcon>
            }
            {
                transactionStatus.received === true ?
                    <div className="text-xs flex flex-col items-center gap-2">
                        {"<" + (transactionStatus.received_at - (isMultiHop === true ? transactionStatus.home_received_at : transactionStatus.confirmed_at))} ms
                    </div> : <Ellipsis className="animate-pulse" color="black" />
            }
            <ChainIcon chain_id={destinationChainId}></ChainIcon>
        </div>
    </Container>
};
