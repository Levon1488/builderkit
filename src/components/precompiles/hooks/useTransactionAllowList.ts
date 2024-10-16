import { useAllowList } from "./useAllowList";

const TX_ALLOW_LIST = "0x0200000000000000000000000000000000000002";

export const useTransactionAllowList = () => {

    const { setAdmin, setEnabled, setManager, setNone, readAllowList } = useAllowList(TX_ALLOW_LIST);

    return { setAdmin, setEnabled, setManager, setNone, readAllowList };

}