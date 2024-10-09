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

    return { getConfig };

}