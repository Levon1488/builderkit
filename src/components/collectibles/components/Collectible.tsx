import React, { useEffect, useState } from 'react';
import { useCollectibles } from './../hooks/useCollectibles';
import { CollectibleProps } from '../types';

export const Collectible: React.FC<CollectibleProps> = (props) => {
    const { address, chain_id, token_id, className } = props;

    const { getCustomToken, resolve } = useCollectibles();
    const [ metadata, setMetadata ] = useState<any>();

    useEffect(() => {
        getCustomToken(chain_id, address, token_id).then(r => {
            const [ name, symbol, uri ] = r;
            if (uri.startsWith("ipfs://")) {
                resolve(uri).then((metadata: any) => {
                    setMetadata(metadata);
                });
            }
        });
    }, [address, token_id]);

    if (metadata === undefined) {
        return <></>;
    }

    return (
        <div className='flex flex-col items-center border rounded-md w-[120px] overflow-hidden'>
            <img src={ metadata.image } alt="" className='w-[120px] h-[120px] min-w-[120px] min-h-[120px]' />
            <div className='bg-white text-sm w-full text-primary-foreground p-2'>
                <p className='text-xs'>#{token_id}</p>
                <p className='font-bold'>{metadata.name}</p>
            </div>
        </div>
    );
};
