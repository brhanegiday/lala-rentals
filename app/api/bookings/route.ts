import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { propertyId, checkIn, checkOut } = data;

    // Check if property is available for these dates
    const existingBooking = await prisma.booking.findFirst({
        where: {
            propertyId,
            status: "CONFIRMED",
            OR: [
                {
                    AND: [
                        { checkIn: { lte: new Date(checkIn) } },
                        { checkOut: { gte: new Date(checkIn) } },
                    ],
                },
                {
                    AND: [
                        { checkIn: { lte: new Date(checkOut) } },
                        { checkOut: { gte: new Date(checkOut) } },
                    ],
                },
            ],
        },
    });

    if (existingBooking) {
        return NextResponse.json(
            { error: "Property is not available for these dates" },
            { status: 400 }
        );
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        return NextResponse.json(
            { error: "Property not found" },
            { status: 404 }
        );
    }

    const booking = await prisma.booking.create({
        data: {
            ...data,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            renterId: session.user.id,
            hostId: property.hostId,
            status: "PENDING",
        },
    });

    return NextResponse.json(booking);
}
