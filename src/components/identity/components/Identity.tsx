import React, { createContext, useContext } from 'react';
import { Domain } from './Domain';
import { IdentityProps } from '../types';

// TODO: check context
const context = {} as IdentityProps;
export const IdentityContext = createContext<IdentityProps>(context);
export function useIdentityContext() {
    return useContext(IdentityContext);
}

export const Identity: React.FC<IdentityProps> = (props) => {
    const { address } = props;

    const addr = address;
    if (addr === undefined) {
        throw new Error("Address: Address not provided!");
    }

    return (<IdentityContext.Provider value={{ address: address }}>
        <Domain showAddressIfNotAvailable={true}></Domain>
    </IdentityContext.Provider>)

};
