import React from "react";
import { Component } from "../../common/types";
import { createAlert } from "../../../components/common/utils/ui.utils";
import { CircleX } from "lucide-react";
import { useFaucetContext } from "./Provider";

export const ErrorMessage: React.FC<Component> = (props) => {
    const {
        error
    } = useFaucetContext();

    return error && createAlert("destructive", <CircleX></CircleX>, "Error!", error);

};
