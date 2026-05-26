"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const globalForPrisma = globalThis;
const createMissingPrismaProxy = () => new Proxy({}, {
    get() {
        throw new Error("Prisma client is not available. Install `@prisma/client`, add your Prisma schema and DATABASE_URL, then generate the client before using payment, check-in, or check-out endpoints.");
    },
});
const createPrismaClient = () => {
    try {
        const { PrismaClient } = require("@prisma/client");
        if (!globalForPrisma.prisma) {
            globalForPrisma.prisma = new PrismaClient();
        }
        return globalForPrisma.prisma;
    }
    catch {
        return createMissingPrismaProxy();
    }
};
exports.prisma = createPrismaClient();
