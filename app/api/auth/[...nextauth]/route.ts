import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }: { session: Session; user: { id: string } }) {
            if (session.user) {
                session.user.id = user.id;
                // Fetch user role from database
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                });
                session.user.role = dbUser?.role || "RENTER"; // Default to RENTER
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };

// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "HOST" | "RENTER";
        } & DefaultSession["user"];
    }
}
