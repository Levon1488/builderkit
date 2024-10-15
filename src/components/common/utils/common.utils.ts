import { useMemo } from "react";

export const useValue = <T>(object: T): T => {
    return useMemo(() => object, [object]);
}

export const search = (list: any[], input: string, fields: string[]) => {
    return list.filter(t => {
        let found = false;
        fields.forEach(f => {
            if (found === true) {
                return;
            }
            let value: string = t[f]?.toLowerCase();
            if (value === undefined) {
                return;
            } else if (value.includes(input.toLowerCase())) {
                found = true;
                return;
            }
        });
        return found;
    });
}