import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { InputProps } from '../types';

export const Input: React.FC<InputProps> = (props) => {
    const { type, placeholder, value = "", disabled = false, icon, onChange, className } = props;

    const [ text, setText ] = useState(value);
    useEffect(() => {
        setText(value);
    }, [value]);

    return (
        <div className={cn("flex w-full gap-2 p-2", className)}>
            {icon}
            <input type={type} disabled={disabled} value={text}
                placeholder={placeholder} className='w-full bg-inherit' onChange={(e) => {
                    setText(e.target.value);
                    if (onChange === undefined) {
                        return;
                    }
                    onChange(e.target.value);
                }} />
        </div>
    );
};
