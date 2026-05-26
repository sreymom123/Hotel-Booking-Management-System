type PrismaLike = {
  [key: string]: any;
};

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaLike;
};

const createMissingPrismaProxy = (): PrismaLike =>
  new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Prisma client is not available. Install `@prisma/client`, add your Prisma schema and DATABASE_URL, then generate the client before using payment, check-in, or check-out endpoints.",
        );
      },
    },
  );

const createPrismaClient = (): PrismaLike => {
  try {
    const { PrismaClient } = require("@prisma/client");

    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }

    return globalForPrisma.prisma as PrismaLike;
  } catch {
    return createMissingPrismaProxy();
  }
};

export const prisma = createPrismaClient();
