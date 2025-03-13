import { PrismaClient } from "@prisma/client";

export default abstract class {
    protected client: PrismaClient;
    constructor() {
        this.client = new PrismaClient();
    }
}
