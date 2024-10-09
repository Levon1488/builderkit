import React from 'react';
import { cn } from '../../../utils/cn';
import { ContainerProps } from '../types';

export const Container: React.FC<ContainerProps> = (props) => {
    const { children, className } = props;
    
    return (<div className={cn("border rounded-md bg-background text-primary-foreground p-4", className)}>
        { children }
    </div>)
};
