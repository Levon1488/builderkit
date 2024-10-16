import { useContracts } from "../../common/hooks/useContracts";
import RewardManager from '../../../resources/abi/precompiles/RewardManager.json';
import { useAllowList } from "./useAllowList";

const REWARD_MANAGER = "0x0200000000000000000000000000000000000004";

export const useRewardManager = () => {

    const { getInterface, getContract } = useContracts();
    const { setAdmin, setEnabled, setManager, setNone, readAllowList } = useAllowList(REWARD_MANAGER);

    const setRewardAddress = async (address: string) => {
        const intf = getInterface(RewardManager);
        return intf.encodeFunctionData("setRewardAddress", [address]);
    }

    const allowFeeRecipients = async () => {
        const intf = getInterface(RewardManager);
        return intf.encodeFunctionData("allowFeeRecipients", []);
    }

    const disableRewards = async () => {
        const intf = getInterface(RewardManager);
        return intf.encodeFunctionData("disableRewards", []);
    }

    const currentRewardAddress = async (chain_id: number) => {
        const contract = getContract(chain_id, REWARD_MANAGER, RewardManager);
        return await contract.currentRewardAddress();
    }

    const areFeeRecipientsAllowed = async (chain_id: number) => {
        const contract = getContract(chain_id, REWARD_MANAGER, RewardManager);
        return await contract.areFeeRecipientsAllowed();
    }

    return {
        setAdmin, setEnabled, setManager, setNone, readAllowList,
        setRewardAddress, allowFeeRecipients, disableRewards, currentRewardAddress,
        areFeeRecipientsAllowed
    };

}