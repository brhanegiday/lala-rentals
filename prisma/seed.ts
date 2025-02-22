// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        // Clean existing data
        await prisma.booking.deleteMany({});
        await prisma.property.deleteMany({});
        await prisma.account.deleteMany({});
        await prisma.session.deleteMany({});
        await prisma.user.deleteMany({});

        console.log("Cleaned up existing data");

        // Create sample users
        const hostUser = await prisma.user.create({
            data: {
                email: "host@example.com",
                name: "Sample Host",
                role: "HOST",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=host",
            },
        });

        const renterUser = await prisma.user.create({
            data: {
                email: "renter@example.com",
                name: "Sample Renter",
                role: "RENTER",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=renter",
            },
        });

        console.log("Created sample users");

        // Create sample properties
        const properties = await Promise.all([
            prisma.property.create({
                data: {
                    title: "Luxury Beachfront Villa",
                    description:
                        "Experience paradise in this stunning beachfront villa with panoramic ocean views.",
                    price: 450.0,
                    location: "Bali, Indonesia",
                    hostId: hostUser.id,
                    images: [
                        "/img/hotel-5.png",
                        "/img/hotel-7.png",
                        "/img/hotel-2.png",
                    ],
                    amenities: ["wifi", "pool", "kitchen", "ac", "workspace"],
                    propertyType: "villa",
                    instantBook: true,
                    rating: 4.8,
                    reviews: 12,
                },
            }),
            prisma.property.create({
                data: {
                    title: "Modern City Apartment",
                    description:
                        "Stylish apartment in the heart of the city with skyline views.",
                    price: 200.0,
                    location: "New York, USA",
                    hostId: hostUser.id,
                    images: [
                        "/img/hotel-7.png",
                        "/img/hotel-8.png",
                        "/img/hotel-9.png",
                    ],
                    amenities: ["wifi", "gym", "parking", "ac"],
                    propertyType: "villa",
                    instantBook: true,
                    rating: 4.8,
                    reviews: 12,
                },
            }),
            prisma.property.create({
                data: {
                    title: "Cozy Mountain Cabin",
                    description:
                        "Rustic cabin surrounded by nature, perfect for a peaceful getaway.",
                    price: 150.0,
                    location: "Aspen, Colorado",
                    hostId: hostUser.id,
                    images: [
                        "/img/hotel-4.png",
                        "/img/hotel-5.png",
                        "/img/hotel-6.png",
                    ],
                    amenities: ["wifi", "kitchen", "parking", "workspace"],
                    propertyType: "villa",
                    instantBook: true,
                    rating: 4.8,
                    reviews: 12,
                },
            }),
            prisma.property.create({
                data: {
                    title: "Seaside Cottage",
                    description: "Charming cottage steps away from the beach.",
                    price: 180.0,
                    location: "Cornwall, UK",
                    hostId: hostUser.id,
                    images: [
                        "/img/hotel-1.png",
                        "/img/hotel-2.png",
                        "/img/hotel-3.png",
                    ],
                    amenities: ["wifi", "kitchen", "parking"],
                    propertyType: "villa",
                    instantBook: true,
                    rating: 4.8,
                    reviews: 12,
                },
            }),
        ]);

        console.log("Created sample properties");

        // Create sample bookings
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const now = new Date();
        const futureDate = new Date(now.getTime() + oneWeek);

        await Promise.all([
            prisma.booking.create({
                data: {
                    propertyId: properties[0].id,
                    renterId: renterUser.id,
                    hostId: hostUser.id,
                    checkIn: now,
                    checkOut: futureDate,
                    status: "CONFIRMED",
                    totalPrice: 450.0 * 7,
                },
            }),
            prisma.booking.create({
                data: {
                    propertyId: properties[1].id,
                    renterId: renterUser.id,
                    hostId: hostUser.id,
                    checkIn: new Date(now.getTime() + oneWeek),
                    checkOut: new Date(now.getTime() + oneWeek * 2),
                    status: "PENDING",
                    totalPrice: 200.0 * 7,
                },
            }),
        ]);

        console.log("Created sample bookings");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
