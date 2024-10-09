import React from 'react';
import { Spinner } from './Spinner';
import { cn } from '../../../utils/cn';
import { Component } from '../types';

export const LoadingIndicator: React.FC<Component> = (props) => {
    const { className } = props;

    return (<div className={cn('flex items-center gap-2 justify-center', className)}>
        <Spinner></Spinner>
        <span>Loading...</span>
    </div>);
};
