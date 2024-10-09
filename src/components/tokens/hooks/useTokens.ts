import { erc20Abi, toHex } from "viem";
import { useContracts } from "../../common/hooks/useContracts";
import { useChains } from "../../../components/common/hooks/useChains";

import { BigNumber } from "bignumber.js";

export const useTokens = () => {

    const { getProvider } = useChains();
    const { getContract } = useContracts();

    const { getInterface } = useContracts();

    const getCustomToken = async (chain_id: number, address: string) => {
        const contract = getContract(chain_id, address, erc20Abi);
        return await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals()
        ]);
    }

    const getNativeBalance = async (chain_id: number, wallet: string) => {
        let provider = getProvider(chain_id);
        return await provider.getBalance(wallet);
    }

    const getBalance = async (chain_id: number, address: string, wallet: string) => {
        if (address === "native") {
            return await getNativeBalance(chain_id, wallet);
        }
        const contract = getContract(chain_id, address, erc20Abi);
        return await contract.balanceOf(wallet);
    }

    const getAllowance = async (chain_id: number, address: string, owner: string, spender: string) => {
        const contract = getContract(chain_id, address, erc20Abi);
        return await contract.allowance(owner, spender);
    }

    const approve = (address: string, spender: string, amount: BigNumber, decimals: number) => {
        const intf = getInterface(erc20Abi);
        const amount_hex = toHex(BigInt(amount.times(10 ** decimals).toFixed(0)));
        let data = intf.encodeFunctionData("approve", [spender, amount_hex]);
        return { to: address, data };
    }

    return { getCustomToken, getBalance, getAllowance, approve };

}