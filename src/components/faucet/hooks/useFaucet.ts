import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useFaucet = () => {

    const getConfig = () => {
        return useQuery({
            queryKey: ['useFaucet', `get-config`],
            queryFn: async () => {
                return await axios.get("/api/faucet/config");
            },
            enabled: true,
            refetchOnWindowFocus: false,
            retry: 0
        });
    }

    const send = (chain_id: number, address: string, receiver: string) => {
        return axios.post("/api/faucet/send", {
            chain_id: chain_id,
            address: address,
            receiver: receiver
        }).then(r => {
            const hash = r.data.hash;
            return [true, hash];
        }).catch((err) => {
            return [false, err.response.data.message];
        });
    }

    return { getConfig, send };

}