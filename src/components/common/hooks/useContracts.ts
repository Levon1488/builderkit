import { ethers } from "ethers";
import { useChains } from "./useChains";

export const useContracts = () => {
    
    const { getProvider } = useChains();

    const getInterface = (abi: any) => {
        return new ethers.Interface(abi);
    }

    const getContract = (chain_id: number, address: string, abi: any) => {
        let provider = getProvider(chain_id);
        return new ethers.Contract(address, abi, provider);
    }

    return { getInterface, getContract };

}