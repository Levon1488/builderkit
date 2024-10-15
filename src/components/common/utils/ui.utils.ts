import { useMemo } from "react";

export const useValue = <T>(object: T): T => {
    return useMemo(() => object, [object]);
}