// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "@/lib/prisma";

// export const authOptions: NextAuthOptions = {
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//     ],
//     pages: {
//         signIn: "/login",
//     },
//     callbacks: {
//         async session({ session, user }) {
//             if (session.user) {
//                 session.user.id = user.id;

//                 // Fetch user role from database
//                 const dbUser = await prisma.user.findUnique({
//                     where: { id: user.id },
//                     select: { role: true },
//                 });

//                 session.user.role = dbUser?.role || "RENTER";
//             }
//             return session;
//         },
//         async signIn({ user, account, profile }) {
//             if (account?.provider === "google") {
//                 if (!user.email) {
//                     return false;
//                 }

//                 // Check if user exists
//                 let dbUser = await prisma.user.findUnique({
//                     where: { email: user.email },
//                 });

//                 // If user doesn't exist, create new user
//                 if (!dbUser) {
//                     dbUser = await prisma.user.create({
//                         data: {
//                             email: user.email,
//                             name: user.name,
//                             image: user.image,
//                             role: "RENTER", // Default role
//                         },
//                     });
//                 }

//                 return true;
//             }
//             return true;
//         },
//     },
//     session: {
//         strategy: "jwt",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// // types/next-auth.d.ts
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string;
//             role: "HOST" | "RENTER";
//         } & DefaultSession["user"];
//     }

//     interface User {
//         role: "HOST" | "RENTER";
//     }
// }

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;

                // Fetch user role from database
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                });

                session.user.role = dbUser?.role || "RENTER";
            }
            return session;
        },
        async signIn({ user, account, profile, credentials }) {
            if (account?.provider === "google") {
                if (!user.email) {
                    return false;
                }

                // Check if user exists
                let dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                // If user doesn't exist, create new user
                if (!dbUser) {
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role: "RENTER", // Default role
                        },
                    });
                }

                return true;
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // If the URL is the role selection page, allow it
            if (url.startsWith("/auth/role-selection")) {
                return url;
            }
            // Default to homepage
            return baseUrl;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
