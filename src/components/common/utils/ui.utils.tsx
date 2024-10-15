import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/Alert";

export const createAlert = (variant: "info" | "destructive", icon: any, title: string, description: string) => {
    return <Alert variant={variant}>
        {icon}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
    </Alert>
}