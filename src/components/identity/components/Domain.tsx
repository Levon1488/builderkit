import { isAddress } from 'ethers';
import React from 'react';
import { useAvaxDomain } from '../hooks/useAvaxDomain';
import { Address } from './Address';
import { useIdentityContext } from './Identity';
import { LoadingIndicator } from '../../common';
import { DomainProps } from '../types';

export const Domain: React.FC<DomainProps> = (props) => {
    const { address, showAddressIfNotAvailable } = props;

    const { address: context_address } = useIdentityContext();
    const addr = address || context_address;
    if (addr === undefined) {
        throw new Error("Address: Address not provided!");
    } else if (isAddress(addr) === false) {
        throw new Error("Identity: Not an address!");
    }
    const { data, isLoading } = useAvaxDomain(addr);
    if (isLoading === true) {
        return <LoadingIndicator></LoadingIndicator>;
    } else if (data?.name === undefined) {
        return showAddressIfNotAvailable === true ? <Address address={addr} abbreviate={true}></Address> : null;
    }
    return (<span>{data.name}</span>);
};
