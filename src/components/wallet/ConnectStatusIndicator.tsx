import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface ConnectStatusProps {
    className?: string;
}

export const ConnectStatusIndicator: React.FC<ConnectStatusProps> = ({ className }) => {

    const [ status, setStatus ] = useState(false);
    const { address } = useAccount();

    useEffect(() => {
        setStatus(address !== undefined);
    }, [address])

    return (
        <div className={`w-[8px] h-[8px] ${status ? 'bg-green-600' : 'bg-red-600'} rounded-full border`}></div>
    );
};
