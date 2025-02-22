// app/api/user/role/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { role } = await request.json();

        if (role !== "HOST" && role !== "RENTER") {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { role },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { error: "Failed to update role" },
            { status: 500 }
        );
    }
}
