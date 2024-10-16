import { useContracts } from "../../../components/common/hooks/useContracts";
import WarpMessenger from '../../../resources/abi/precompiles/WarpMessenger.json';

const WARP_MESSENGER = "0x0200000000000000000000000000000000000005";

export const useWarpMessenger = () => {

    const { getInterface, getContract } = useContracts();

    const sendWarpMessage = async (payload: string) => {
        const intf = getInterface(WarpMessenger);
        return intf.encodeFunctionData("sendWarpMessage", [ payload ]);
    }

    const getVerifiedWarpMessage = async (chain_id: number, index: number) => {
        const contract = getContract(chain_id, WARP_MESSENGER, WarpMessenger);
        return await contract.getVerifiedWarpMessage(index);
    }

    const getVerifiedWarpBlockHash = async (chain_id: number, index: number) => {
        const contract = getContract(chain_id, WARP_MESSENGER, WarpMessenger);
        return await contract.getVerifiedWarpBlockHash(index);
    }

    const getBlockchainId = async (chain_id: number) => {
        const contract = getContract(chain_id, WARP_MESSENGER, WarpMessenger);
        return await contract.getBlockchainID();
    }

    return { sendWarpMessage, getVerifiedWarpMessage, getVerifiedWarpBlockHash, getBlockchainId };

}