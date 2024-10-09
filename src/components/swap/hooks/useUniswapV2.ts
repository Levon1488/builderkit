import { toHex } from 'viem';
import { useContracts } from '../../../components/common/hooks/useContracts';

import UniswapV2Factory from '../../../resources/abi/UniswapV2Factory.json';
import UniswapV2Pair from '../../../resources/abi/UniswapV2Pair.json';
import UniswapV2Router from '../../../resources/abi/UniswapV2Router.json';

import { BigNumber } from "bignumber.js";

const FACTORY_CONTRACTS: any = {
    "43113": "0xF5c7d9733e5f53abCC1695820c4818C59B457C2C",
    "43114": "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10"
}

const ROUTER_CONTRACTS: any = {
    "43113": "0xd7f655E3376cE2D7A2b08fF01Eb3B1023191A901",
    "43114": "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"
}

export const useUniswapV2 = () => {

    const { getContract, getInterface } = useContracts();

    const getPair = async (chain_id: number, token_in: any, token_out: any) => {
        const contract = getContract(chain_id, FACTORY_CONTRACTS[chain_id.toString()], UniswapV2Factory);
        return await contract.getPair(
            token_in.address === "native" ? token_in.wrapped_address : token_in.address,
            token_out.address === "native" ? token_out.wrapped_address : token_out.address
        );
    }

    const getReserves = async (chain_id: number, pair: string) => {
        const contract = getContract(chain_id, pair, UniswapV2Pair);
        return await contract.getReserves();
    }

    const getAmountOut = (reserves: [BigNumber, BigNumber], amount_in: BigNumber, token_in: any, token_out: any, fee: number = 3) => {
        // Get correct reserves
        let token_id_addr = token_in.address === "native" ? token_in.wrapped_address : token_in.address;
        let token_out_addr = token_out.address === "native" ? token_out.wrapped_address : token_out.address;
        const sorts_before = token_id_addr.toLowerCase() < token_out_addr.toLowerCase();
        let reserve_in = (sorts_before ? reserves[0] : reserves[1]).div(10 ** token_in.decimals);
        let reserve_out = (sorts_before ? reserves[1] : reserves[0]).div(10 ** token_out.decimals);
        // Calculate here
        let amount_with_fee = amount_in.times(1000 - fee);
        let numerator = amount_with_fee.times(reserve_out);
        let denominator = (reserve_in.times(1000)).plus(amount_with_fee);
        return numerator.div(denominator);
    }

    const getQuote = async (chain_id: number, token_in: any, token_out: any, amount_in: BigNumber) => {
        const pair = await getPair(chain_id, token_in, token_out);
        if (pair === "0x0000000000000000000000000000000000000000") {
            return new BigNumber(-1);
        }
        const reserves = await getReserves(chain_id, pair);
        const quote = getAmountOut([
            new BigNumber(reserves[0].toString()),
            new BigNumber(reserves[1].toString()),
        ], amount_in, token_in, token_out);
        return quote;
    }

    const getMinAmountOut = (amount: BigNumber, slippage: number = 3): BigNumber => {
        return amount.times(1000 - slippage).div(1000);
    }

    const getSwapTransaction = async (chain_id: number, token_in: any, token_out: any,
        amount_in: BigNumber, amount_out: BigNumber, receiver: string) => {
        // create interface
        const intf = getInterface(UniswapV2Router);
        // prepare parameters
        const a_in = toHex(BigInt(amount_in.times(10 ** token_in.decimals).toFixed(0)));
        const a_out = toHex(BigInt(getMinAmountOut(amount_out).times(10 ** token_out.decimals).toFixed(0)));
        let token_id_addr = token_in.address === "native" ? token_in.wrapped_address : token_in.address;
        let token_out_addr = token_out.address === "native" ? token_out.wrapped_address : token_out.address;
        const path = [token_id_addr, token_out_addr];
        const deadline = toHex(new Date().getTime() + 10 * 60 * 1000);
        const to = ROUTER_CONTRACTS[chain_id.toString()];
        // build function data
        let method = "swapExactTokensForTokens";
        if (token_in.address === "native") {
            method = "swapExactAVAXForTokens";
            let data = intf.encodeFunctionData(method, [a_out, path, receiver, deadline]);
            return { to, data, value: a_in };
        } else if (token_out.address === "native") {
            method = "swapExactTokensForAVAX";
            let data = intf.encodeFunctionData(method, [a_in, a_out, path, receiver, deadline]);
            return { to, data, value: "0x0" };
        }
        let data = intf.encodeFunctionData(method, [a_in, a_out, path, receiver, deadline]);
        return { to, data, value: "0x0" };
    }

    return { getPair, getReserves, getQuote, getSwapTransaction };

}