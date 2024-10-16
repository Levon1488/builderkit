import { useContracts } from "../../common/hooks/useContracts";
import FeeManager from '../../../resources/abi/precompiles/FeeManager.json';
import { useAllowList } from "./useAllowList";

const FEE_MANAGER = "0x0200000000000000000000000000000000000003";

export const useFeeManager = () => {

    const { getInterface, getContract } = useContracts();
    const { setAdmin, setEnabled, setManager, setNone, readAllowList } = useAllowList(FEE_MANAGER);

    const setFeeConfig = (
        gasLimit: string,
        targetBlockRate: string,
        minBaseFee: string,
        targetGas: string,
        baseFeeChangeDenominator: string,
        minBlockGasCost: string,
        maxBlockGasCost: string,
        blockGasCostStep: string
    ) => {
        const intf = getInterface(FeeManager);
        return intf.encodeFunctionData("setFeeConfig", [
            gasLimit, targetBlockRate, minBaseFee, targetGas, baseFeeChangeDenominator,
            minBlockGasCost, maxBlockGasCost, blockGasCostStep
        ]);
    }

    const getFeeConfig = async (chain_id: number) => {
        const contract = getContract(chain_id, FEE_MANAGER, FeeManager);
        return await contract.getFeeConfig();
    }

    const getFeeConfigLastChangedAt = async (chain_id: number) => {
        const contract = getContract(chain_id, FEE_MANAGER, FeeManager);
        return await contract.getFeeConfigLastChangedAt();
    }

    return {
        setAdmin, setEnabled, setManager, setNone, readAllowList,
        setFeeConfig, getFeeConfig, getFeeConfigLastChangedAt
    };

}