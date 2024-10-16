import { useAllowList } from "./useAllowList";

const DEPLOYER_ALLOW_LIST = "0x0200000000000000000000000000000000000000";

export const useDeployerAllowList = () => {

    const { setAdmin, setEnabled, setManager, setNone, readAllowList } = useAllowList(DEPLOYER_ALLOW_LIST);

    return { setAdmin, setEnabled, setManager, setNone, readAllowList };

}