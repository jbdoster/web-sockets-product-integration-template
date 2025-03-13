import Abstract from "./Abstract";

import { rules } from "@prisma/client";

export type Properties = rules;

class Class extends Abstract {
    constructor() {
        super();
    }

    readAll(): Promise<Properties[]> {
        return this.client.rules.findMany()
        .catch(
            error => {
                console.error(error);
                throw error;
            }
        )
    }
}

export const Query = new Class();
