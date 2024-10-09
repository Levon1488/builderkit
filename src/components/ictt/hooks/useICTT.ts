import { decodeEventLog, toHex } from "viem";
import { useContracts } from "../../../components/common/hooks/useContracts";
import ERC20Transferer from '../../../resources/abi/ERC20Transferer.json';
import NativeTransferer from '../../../resources/abi/NativeTransferer.json';
import TeleporterMessenger from '../../../resources/abi/TeleporterMessenger.json';
import ICMRegistry from '../../../resources/abi/ICMRegistry.json';
import { BigNumber } from "bignumber.js";
import { useChains } from "../../../components/common";

export const useICTT = () => {

    const { getContract, getInterface } = useContracts();
    const { getChain, getProvider } = useChains();

    const getInterchainMessenger = async (chain_id: number) => {
        const chain: any = getChain(chain_id);
        if (chain === undefined) {
            return;
        }
        const registry = chain.icm_registry;
        const contract = getContract(chain_id, registry, ICMRegistry);
        return await contract.getLatestTeleporter();
    }

    const send = (transferer: string, destination_L1_hex: string, destination_transferer: string, receiver: string,
        fee_token_addr: string, amount: BigNumber, decimals: number, is_multi_hop: boolean
    ) => {
        const intf = getInterface(ERC20Transferer);
        let amount_hex = toHex(BigInt(amount.times(10 ** decimals).toFixed(0)));
        let data = intf.encodeFunctionData("send", [
            [ destination_L1_hex, destination_transferer, receiver, fee_token_addr, 0, 0, 250000, is_multi_hop ? receiver : "0x0000000000000000000000000000000000000000" ], 
            amount_hex
        ]);
        return { to: transferer, data, value: "0x0" };
    }

    const sendNative = (transferer: string, destination_L1_hex: string, destination_transferer: string, receiver: string,
        fee_token_addr: string, amount: BigNumber, decimals: number, is_multi_hop: boolean
    ) => {
        const intf = getInterface(NativeTransferer);
        let amount_hex = toHex(BigInt(amount.times(10 ** decimals).toFixed(0)));
        let data = intf.encodeFunctionData("send", [
            [ destination_L1_hex, destination_transferer, receiver, fee_token_addr, 0, 0, 250000, is_multi_hop ? receiver : "0x0000000000000000000000000000000000000000" ] 
        ]);
        return { to: transferer, data, value: amount_hex };
    }

    const getMessageId = (log: any) => {
        const decoded_log: any = decodeEventLog({
            abi: TeleporterMessenger,
            data: log.data,
            topics: log.topics

        });
        const { args } = decoded_log;
        const { messageID } = args;
        return messageID;
    }

    const getReceiveTransaction = async (chain_id: number, message_id: string) => {
        const provider = getProvider(chain_id);
        const logs = await provider.getLogs({
            topics: [
                "0x292ee90bbaf70b5d4936025e09d56ba08f3e421156b6a568cf3c2840d9343e34",
                message_id
            ]
        });
        if (logs.length === 0) {
            return;
        }
        return logs[0];
    }

    const getHomeHopMessageId = async (chain_id: number, hash: string) => {
        const provider = getProvider(chain_id);
        const receipt = await provider.getTransactionReceipt(hash);
        if (receipt === null) {
            return;
        }
        const messenger = await getInterchainMessenger(chain_id);
        const log: any = receipt.logs.find(l => l.address.toLowerCase() === messenger.toLowerCase() && 
            l.topics[0].toLowerCase() === "0x2a211ad4a59ab9d003852404f9c57c690704ee755f3c79d2c2812ad32da99df8".toLowerCase());
        return getMessageId(log);
    }

    return { getInterchainMessenger, send, sendNative, getMessageId, getReceiveTransaction, getHomeHopMessageId };

}