import { isAddress } from 'ethers';
import React from 'react';
import { getAbbreviatedAddress } from '../util';
import { useIdentityContext } from './Identity';
import { IdentityProps } from '../types';

export const Address: React.FC<IdentityProps> = (props) => {
    const { address, abbreviate = false } = props;

    const { address: context_address } = useIdentityContext(); // Todo: check context?
    const addr = address || context_address;
    if (addr === undefined) {
        throw new Error("Address: Address not provided!");
    } else if (isAddress(addr) === false) {
        throw new Error("Address: Not an address!");
    }
    return (
        <span>{abbreviate === true ? getAbbreviatedAddress(addr) : addr}</span>
    );
};
