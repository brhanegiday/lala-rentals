import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Test database connection
        await prisma.$connect();

        // Count properties
        const propertyCount = await prisma.property.count();

        // Count users
        const userCount = await prisma.user.count();

        return NextResponse.json({
            status: "Connected",
            counts: {
                properties: propertyCount,
                users: userCount,
            },
        });
    } catch (error) {
        console.error("Database connection test failed:", error);
        return NextResponse.json(
            {
                error: "Database connection failed",
                details: error.message,
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

