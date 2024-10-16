import { useContracts } from "../../common/hooks/useContracts";
import AllowList from '../../../resources/abi/precompiles/AllowList.json';

export const useAllowList = (precompile_address: string) => {

    const { getInterface, getContract } = useContracts();

    const setAdmin = (address: string) => {
        const intf = getInterface(AllowList);
        return intf.encodeFunctionData("setAdmin", [address]);
    }

    const setEnabled = (address: string) => {
        const intf = getInterface(AllowList);
        return intf.encodeFunctionData("setEnabled", [address]);
    }

    const setManager = (address: string) => {
        const intf = getInterface(AllowList);
        return intf.encodeFunctionData("setManager", [address]);
    }

    const setNone = (address: string) => {
        const intf = getInterface(AllowList);
        return intf.encodeFunctionData("setNone", [address]);
    }

    const readAllowList = async (chain_id: number, address: string) => {
        const contract = getContract(chain_id, precompile_address, AllowList);
        return await contract.readAllowList(address);
    }

    return { setAdmin, setEnabled, setManager, setNone, readAllowList };

}