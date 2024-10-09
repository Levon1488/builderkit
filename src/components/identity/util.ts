import { ethers } from 'ethers';
import AVVY from '@avvy/client';
import { C_CHAIN_RPC_URL } from '../../constants';

export const getAbbreviatedAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getAvaxDomain = async (address: string, type: string = "EVM") => {
    const provider = new ethers.JsonRpcProvider(C_CHAIN_RPC_URL);
    const avvy = new AVVY(provider, {});
    const record_type = (<any>(AVVY.RECORDS))[type];
    const result = await avvy.reverse(record_type, address);
    if (result === null || result === undefined) {
        throw new Error("Domain is not found!");
    }
    return await result.lookup();
}