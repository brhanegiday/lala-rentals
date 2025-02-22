import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session: Session | null = await getServerSession(authOptions);
    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
        include: { property: true },
    });

    if (
        !session ||
        !booking ||
        (booking.hostId !== session.user.id &&
            booking.renterId !== session.user.id)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { status } = data;

    // Only hosts can confirm bookings
    if (status === "CONFIRMED" && booking.hostId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: params.id },
        data: { status },
    });

    return NextResponse.json(updatedBooking);
}
