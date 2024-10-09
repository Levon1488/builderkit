import React, { useMemo } from 'react';
import { ButtonProps } from '../types';
import { LoadingIndicator } from '../../../components/common';
import { cn } from '../../../utils/cn';

export const Button: React.FC<ButtonProps> = (props) => {
    const { label, action, status, className } = props;

    const button = useMemo(() => <button className={cn(className, status === "disabled" ? "bg-gray-600 cursor-not-allowed" : "cursor-pointer")}
        onClick={() => {
            if (status === "disabled" || status === "loading") {
                return;
            }
            action();
        }}>
        { status === "loading" ? <LoadingIndicator></LoadingIndicator> : label }
    </button>, [label, status]);

    return ( button );
};