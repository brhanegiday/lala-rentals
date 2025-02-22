// app/api/properties/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        console.log("Fetching properties - Request received");

        const { searchParams } = new URL(req.url);
        console.log(
            "Search params:",
            Object.fromEntries(searchParams.entries())
        );

        const location = searchParams.get("location");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const propertyType = searchParams.get("propertyType");
        const amenities = searchParams.get("amenities")?.split(",");

        // Build where clause
        const whereClause: any = {
            // Add this to ensure we only get valid listings
            AND: [
                { title: { not: null } },
                { description: { not: null } },
                { price: { not: null } },
            ],
        };

        if (location) {
            whereClause.location = {
                contains: location,
                mode: "insensitive",
            };
        }

        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price.gte = parseFloat(minPrice);
            if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
        }

        if (propertyType && propertyType !== "all") {
            whereClause.propertyType = propertyType;
        }

        if (amenities && amenities.length > 0) {
            whereClause.amenities = {
                hasEvery: amenities,
            };
        }


        const properties = await prisma.property.findMany({
            // where: whereClause,
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                bookings: {
                    select: {
                        checkIn: true,
                        checkOut: true,
                        status: true,
                    },
                    where: {
                        status: "CONFIRMED",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });


        // Transform the data to match your frontend expectations
        const transformedProperties = properties.map((property) => ({
            id: property.id,
            title: property.title,
            description: property.description,
            location: property.location,
            price: property.price,
            images: property.images,
            amenities: property.amenities,
            rating: 4.5, // You might want to calculate this based on reviews later
            reviews: 10, // You might want to add this to your schema later
            propertyType: property.propertyType || "house", // Fallback to 'house' if not specified
            instantBook: true, // You might want to add this to your schema later
            host: {
                id: property.host.id,
                name: property.host.name,
                image: property.host.image,
            },
            bookings: property.bookings,
        }));

        return NextResponse.json(transformedProperties);
    } catch (error) {
        console.error("Error in GET /api/properties:", error);
        return NextResponse.json(
            { error: "Failed to fetch properties" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "HOST") {
            return NextResponse.json(
                { error: "Unauthorized - Only hosts can create properties" },
                { status: 401 }
            );
        }

        const data = await req.json();

        // Validate required fields
        const requiredFields = ["title", "description", "price", "location"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Ensure price is a valid number
        const price = parseFloat(data.price);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json(
                { error: "Invalid price" },
                { status: 400 }
            );
        }

        const property = await prisma.property.create({
            data: {
                ...data,
                price,
                hostId: session.user.id,
                images: data.images || [],
                amenities: data.amenities || [],
                propertyType: data.propertyType || "house",
            },
            include: {
                host: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("Error in POST /api/properties:", error);
        return NextResponse.json(
            { error: "Failed to create property" },
            { status: 500 }
        );
    }
}
