import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

import { Session } from "next-auth";

import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const property = await prisma.property.findUnique({
        where: { id: params.id },
        include: {
            host: {
                select: {
                    name: true,
                    image: true,
                },
            },
            bookings: true,
        },
    });

    if (!property) {
        return NextResponse.json(
            { error: "Property not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(property);
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session: Session | null = await getServerSession(authOptions);
    const property = await prisma.property.findUnique({
        where: { id: params.id },
    });

    if (!session || !property || property.hostId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updatedProperty = await prisma.property.update({
        where: { id: params.id },
        data,
    });

    return NextResponse.json(updatedProperty);
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session: Session | null = await getServerSession(authOptions);
    const property = await prisma.property.findUnique({
        where: { id: params.id },
    });

    if (!session || !property || property.hostId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.property.delete({
        where: { id: params.id },
    });

    return NextResponse.json({ success: true });
}

// import { headers } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Validate the ID parameter
        const id = params.id;
        if (!id) {
            return NextResponse.json(
                { error: "Property ID is required" },
                { status: 400 }
            );
        }

        // Fetch the property
        const property = await prisma.property.findUnique({
            where: {
                id: id.toString(),
            },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        // createdAt: true,
                    },
                },
                bookings: {
                    where: {
                        status: "CONFIRMED",
                    },
                    select: {
                        checkIn: true,
                        checkOut: true,
                    },
                },
            },
        });

        if (!property) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }

        // Transform the data
        const transformedProperty = {
            id: property.id,
            title: property.title,
            description: property.description,
            location: property.location,
            price: property.price,
            images: property.images || [],
            amenities: property.amenities || [],
            rating: property.rating || 4.5,
            reviews: 0,
            host: {
                id: property.host.id,
                name: property.host.name || "Anonymous Host",
                image: property.host.image,
                responseTime: "within an hour",
                // joinedDate: new Date(property.host.createdAt)
                //     .getFullYear()
                //     .toString(),
            },
            instantBook: true,
            bookings: property.bookings.map((booking) => ({
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
            })),
        };

        return NextResponse.json(transformedProperty);
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch property details",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
