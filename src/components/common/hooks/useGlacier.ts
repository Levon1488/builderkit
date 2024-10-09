import { AvaCloudSDK } from "@avalabs/avacloud-sdk";

export const useGlacier = () => {

    const getSdk = (chain_id: number) => {
        return new AvaCloudSDK({ chainId: chain_id.toString() });
    }

    const getChainInformation = async (chain_id: number) => {
        return await getSdk(chain_id).data.evm.chains.getChainInfo({ chainId: chain_id.toString() });
    }

    const listErc20Balances = async (chain_id: number, address: string) => {
        const response = await getSdk(chain_id).data.evm.balances.listErc20Balances({ address })
        const { result } = response;
        return result.erc20TokenBalances;
    }

    return { getChainInformation, listErc20Balances };

}