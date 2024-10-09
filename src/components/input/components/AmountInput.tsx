import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { parseNumberInput } from '../../common/utils/number.utils';
import { InputProps } from '../types';

export const AmountInput: React.FC<InputProps> = (props) => {
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
                    let value = parseNumberInput(e.target.value);
                    setText(value);
                    if (onChange === undefined) {
                        return;
                    }
                    onChange(value);
                }} />
        </div>
    );
};
