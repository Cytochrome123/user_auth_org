"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAdapter = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BaseAdapter {
    constructor() {
        this.catchError = (error) => {
            // logger.error(error);
            // console.error(error)
            throw new Error("Failed at db level");
        };
    }
}
exports.BaseAdapter = BaseAdapter;
exports.default = prisma;
