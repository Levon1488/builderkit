import { erc721Abi } from "viem";
import { useContracts } from "../../common/hooks/useContracts";
import axios from "axios";

export const useCollectibles = () => {

    const { getContract } = useContracts();

    const getCustomToken = async (chain_id: number, address: string, token_id: number) => {
        const contract = getContract(chain_id, address, erc721Abi);
        return await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.tokenURI(token_id),
        ]);
    }

    const getImageUrl = (uri: string, resolver: string = "https://ipfs.io") => {
        return `${resolver}/ipfs/${uri.split("ipfs://")[1]}`;
    }

    const resolveIpfsUri = async (uri: string, resolver: string = "https://ipfs.io") => {
        const url = getImageUrl(uri, resolver);
        const response = await axios.get(url);
        const { data } = response;
        return data;
    }

    const resolve = async (uri: string) => {
        const metadata = await resolveIpfsUri(uri);
        const { name, description, image, attributes } = metadata;
        return { name, description, image: getImageUrl(image), attributes };
    }

    return { getCustomToken, resolve };

}