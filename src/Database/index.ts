import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export class BaseAdapter {
    public catchError = (error: any) => {
        // logger.error(error);
        // console.error(error)
        throw new Error("Failed at db level")
    }
}

export default prisma;