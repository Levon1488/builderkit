import { useContracts } from "../../../components/common/hooks/useContracts";
import WarpMessenger from '../../../resources/abi/WarpMessenger.json';

const WARP_MESSENGER = "0x0200000000000000000000000000000000000005";

export const useWarpMessenger = () => {

    const { getContract } = useContracts();

    const getBlockchainId = async (chain_id: number) => {
        const contract = getContract(chain_id, WARP_MESSENGER, WarpMessenger);
        return await contract.getBlockchainID();
    }

    return { getBlockchainId };

}