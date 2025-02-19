import React from "react";
import { Search, MapPin, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const HomePage = () => {
    const properties = [
        {
            id: 1,
            title: "Luxury Beachfront Villa",
            location: "Bali, Indonesia",
            price: 250,
            imageUrl: "/api/placeholder/600/400",
            rating: 4.9,
            reviews: 128,
        },
        {
            id: 2,
            title: "Modern City Apartment",
            location: "New York, USA",
            price: 180,
            imageUrl: "/api/placeholder/600/400",
            rating: 4.7,
            reviews: 84,
        },
        {
            id: 3,
            title: "Cozy Mountain Lodge",
            location: "Aspen, USA",
            price: 350,
            imageUrl: "/api/placeholder/600/400",
            rating: 4.8,
            reviews: 98,
        },
        {
            id: 4,
            title: "Exotic Jungle Treehouse",
            location: "Amazon, Brazil",
            price: 200,
            imageUrl: "/api/placeholder/600/400",
            rating: 4.6,
            reviews: 112,
        },
        {
            id: 5,
            title: "Romantic Lakeside Cottage",
            location: "Queenstown, New Zealand",
            price: 180,
            imageUrl: "/api/placeholder/600/400",
            rating: 4.9,
            reviews: 124,
        },
        {
            id: 6,
            title: "Family Countryside Farmhouse",
            location: "Cotswolds, UK",
            price: 220,
            imageUrl: "/api/placeholder/600/400",
            rating: 4.7,
            reviews: 92,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            Find your perfect stay
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
                            Book unique homes and experiences all over the
                            world.
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="mt-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 w-full md:w-64"
                                    placeholder="Where are you going?"
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 w-full md:w-48"
                                    placeholder="Check-in"
                                    type="date"
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 w-full md:w-48"
                                    placeholder="Check-out"
                                    type="date"
                                />
                            </div>

                            <Button className="w-full md:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Listings */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Featured Properties
                    </h2>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                        <Card key={property.id} className="overflow-hidden">
                            <CardHeader className="p-0">
                                <Image
                                    src={property.imageUrl}
                                    alt={property.title}
                                    className="h-48 w-full object-cover"
                                    width={600}
                                    height={400}
                                />
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {property.title}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <MapPin className="inline-block h-4 w-4 mr-1" />
                                            {property.location}
                                        </p>
                                    </div>
                                    <Badge variant="secondary">
                                        ★ {property.rating}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center p-4 pt-0">
                                <p className="text-lg font-bold">
                                    ${property.price}{" "}
                                    <span className="text-sm font-normal text-gray-500">
                                        / night
                                    </span>
                                </p>
                                <Button size="sm">Book Now</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
