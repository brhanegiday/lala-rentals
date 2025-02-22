// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isHostRoute = req.nextUrl.pathname.startsWith("/host");
        

        // If trying to access host routes without HOST role
        // if (isHostRoute && token?.role !== "HOST") {
        //     return NextResponse.redirect(new URL("/login", req.url));
        // }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/host/:path*", "/bookings/:path*", "/account/:path*"],
};
