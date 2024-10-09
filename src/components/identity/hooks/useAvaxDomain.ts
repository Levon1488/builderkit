import { useQuery } from "@tanstack/react-query";
import { getAvaxDomain } from "../util";

export const useAvaxDomain = (address: string) => {
    return useQuery({
        queryKey: ['useAvaxDomain', `get-avax-domain-${address}`],
        queryFn: async () => {
            return await getAvaxDomain(address);
        },
        enabled: true,
        refetchOnWindowFocus: false,
        retry: 0
    });
}