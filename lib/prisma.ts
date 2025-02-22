import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// import { PrismaClient } from "@prisma/client";

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === "production") {
//     prisma = new PrismaClient();
// } else {
//     // Ensure we don't create multiple instances in development
//     if (!(global as any).prisma) {
//         (global as any).prisma = new PrismaClient({
//             log: ["query", "error", "warn"],
//         });
//     }
//     prisma = (global as any).prisma;
// }

// export default prisma;
