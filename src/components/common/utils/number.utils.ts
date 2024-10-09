import { BigNumber } from "bignumber.js";

export const getNormalizedBN = (value: bigint, decimals: number = 18) => {
    let bn = new BigNumber(value.toString());
    return bn.div(10 ** decimals);
}

export const parseNumberInput = (input: string): string => {
    // 1. Strip the string of all non-integer or decimal characters.
    const stripped = input.replace(/[^0-9.]/g, '');
    // 2. Remove all decimal points after the first one.
    return stripped.replace(/(\.\d*?)\./g, '$1');
};