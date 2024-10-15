import React from "react";
import { Component } from "../../common/types";
import { useFaucetContext } from "./Provider";
import { Button } from "../../../components/control";
import { useFaucet } from "../hooks/useFaucet";
import { toast } from "sonner";

export const Action: React.FC<Component> = (props) => {
    const {
        chains,
        selectedChain,
        selectedToken,
        address,
        isFormValid,
        buttonStatus, setButtonStatus,
        setError,
    } = useFaucetContext();

    const { send } = useFaucet();

    const onRequestClicked = async () => {
        if (buttonStatus !== "idle" || isFormValid() === false || selectedChain === undefined || selectedToken === undefined) {
            return;
        }
        setError(undefined);
        // call send method
        setButtonStatus("loading");
        const [status, result] = await send(selectedChain, selectedToken.address, address);
        setButtonStatus("disabled");
        if (status === true) {
            const chain = chains.find(c => c.id === selectedChain);
            const explorer_url = chain?.blockExplorers?.default.url;
            toast("Transaction has been sent!", {
                description: new Date().toLocaleString(),
                action: {
                    label: "View",
                    onClick: () => window.open(`${explorer_url}/tx/${result}`, '_blank', 'noopener,noreferrer'),
                },
                classNames: {
                    toast: "!bg-green-900 !text-white border-0",
                    description: " !text-white opacity-50 text-xs"
                }
            });
            return;
        }
        setButtonStatus("disabled");
        setError(result);
    }

    return selectedToken && <Button className={`bg-green-600 text-white p-2 rounded`}
        label={`Request ${selectedToken.drip_amount} ${selectedToken.symbol}`}
        action={onRequestClicked} status={isFormValid() ? buttonStatus : "disabled"}>
    </Button>

};
