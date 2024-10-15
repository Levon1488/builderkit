import React from "react";
import { Component } from "../../common/types";

export const Header: React.FC<Component> = (props) => {

    return <div className="w-full flex items-center justify-between">
        <h1 className="font-semibold">Faucet</h1>
    </div>

};
