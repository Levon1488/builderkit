"use client"

import { Ban } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import { IconProps } from '../types';

export const Icon: React.FC<IconProps> = (props) => {
    const { src, size = 24, className } = props;

    const [errored, setErrored] = useState<boolean>(false);

    useEffect(() => {
        setErrored(false);
    }, [src]);

    const style = useMemo(() => {
        return {
            width: `${size}px`,
            height: `${size}px`,
            minWidth: `${size}px`,
            minHeight: `${size}px`,
        };
    }, [size]);

    return (
        <div className={cn("rounded-full overflow-hidden", className)}>
            {
                errored === true ? <Ban size={24}></Ban> :
                    <img src={src} alt="logo"
                        className={`rounded-full`}
                        style={style}
                        onError={() => { setErrored(true); }} />
            }
        </div>
    );
};
