import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { InputProps } from '../types';
import { isAddress } from 'viem';

export const AddressInput: React.FC<InputProps> = (props) => {
    const { placeholder, value = "", disabled = false, icon, onChange, className } = props;

    const [ text, setText ] = useState(value);
    useEffect(() => {
        setText(value);
    }, [value]);

    const [ valid, setValid ] = useState<any>(undefined);

    return (
        <div className={cn(`flex w-full gap-2 p-2 ${valid === false ? 'ring ring-2 ring-destructive/50 rounded-md' : 'border-0'}`, className)}>
            {icon}
            <input type="text" disabled={disabled} value={text} name='address'
                placeholder={placeholder} className='w-full bg-inherit' onChange={(e) => {
                    let text = e.target.value;
                    setText(text);
                    const is_address = isAddress(text);
                    setValid(is_address);
                    if (onChange === undefined) {
                        return;
                    }
                    onChange(is_address ? text : "");
                }} />
        </div>
    );
};
