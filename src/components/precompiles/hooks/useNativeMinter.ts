import { useContracts } from "../../common/hooks/useContracts";
import NativeMinter from '../../../resources/abi/precompiles/NativeMinter.json';
import { useAllowList } from "./useAllowList";

const NATIVE_MINTER = "0x0200000000000000000000000000000000000001";

export const useNativeMinter = () => {

    const { getInterface } = useContracts();
    const { setAdmin, setEnabled, setManager, setNone, readAllowList } = useAllowList(NATIVE_MINTER);

    const mintNativeCoin = (address: string, amount_hex: `0x${string}`) => {
        const intf = getInterface(NativeMinter);
        return intf.encodeFunctionData("mintNativeCoin", [address, amount_hex]);
    }

    return { setAdmin, setEnabled, setManager, setNone, readAllowList, mintNativeCoin };

}