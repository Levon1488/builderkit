import { useChains as useWagmiChains } from "wagmi";
import { ethers } from "ethers";
import { toHex } from "viem";

export const useChains = () => {

    const chains = useWagmiChains();

    const getChains = () => {
        return chains;
    }

    const getChain = (chain_id: number) => {
        return chains.find(c => c.id === chain_id);
    }

    const getProvider = (chain_id: number) => {
        const chain = chains.find(c => c.id === chain_id);
        if (chain === undefined) {
            throw new Error("Chain is not whitelisted!");
        }
        let rpc_url = chain.rpcUrls.default.http[0];
        let provider = new ethers.JsonRpcProvider(rpc_url, { chainId: chain_id, name: "NW" });
        return provider;
    }

    const getBlock = async (chain_id: number, block_number: number) => {
        const chain = chains.find(c => c.id === chain_id);
        if (chain === undefined) {
            throw new Error("Chain is not whitelisted!");
        }
        let rpc_url = chain.rpcUrls.default.http[0];
        let provider = new ethers.JsonRpcProvider(rpc_url, { chainId: chain_id, name: "NW" });
        return await provider.getBlock(toHex(block_number));
    }

    return { getChains, getChain, getProvider, getBlock };

}