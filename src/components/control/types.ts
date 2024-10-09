import { Component } from "../common/types";

export type ButtonProps = {
    label: string;
    action: () => void;
    status?: "idle" | "disabled" | "loading";
} & Component;

export type ConnectButtonProps = {
    showConnectedWallet?: boolean;
    checkWrongNetwork?: boolean;
} & Component;