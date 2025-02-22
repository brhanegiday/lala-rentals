"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icons
import {
    Calendar,
    Filter,
    Grid,
    Map as MapIcon,
    MapPin,
    Search,
    Loader2,
} from "lucide-react";

// Types
interface Property {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    rating?: number;
    reviews?: number;
    propertyType: string;
    amenities: string[];
    instantBook: boolean;
    hostId: string;
    createdAt?: Date;
}

interface SearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
}

interface Filters {
    propertyType: string;
    amenities: string[];
    instantBook: boolean;
}

const HomePage = () => {
    // State
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [filters, setFilters] = useState<Filters>({
        propertyType: "all",
        amenities: [],
        instantBook: false,
    });
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        location: "",
        checkIn: "",
        checkOut: "",
    });

    // Hooks
    const router = useRouter();
    const { data: session, status } = useSession();

    // Constants
    const amenitiesList = [
        { id: "wifi", label: "WiFi" },
        { id: "pool", label: "Pool" },
        { id: "gym", label: "Gym" },
        { id: "kitchen", label: "Kitchen" },
        { id: "parking", label: "Parking" },
        { id: "ac", label: "Air Conditioning" },
        { id: "workspace", label: "Workspace" },
    ];

    const propertyTypes = [
        { value: "all", label: "All Properties" },
        { value: "apartment", label: "Apartments" },
        { value: "house", label: "Houses" },
        { value: "villa", label: "Villas" },
        { value: "condo", label: "Condos" },
    ];

    // Fetch properties
    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchParams.location) {
                params.append("location", searchParams.location);
            }
            if (searchParams.checkIn) {
                params.append("checkIn", searchParams.checkIn);
            }
            if (searchParams.checkOut) {
                params.append("checkOut", searchParams.checkOut);
            }

            const response = await fetch(
                `/api/properties?${params.toString()}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setError("Failed to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Filter properties
    const filteredProperties = properties.filter((property) => {
        const matchesPrice =
            property.price >= priceRange[0] && property.price <= priceRange[1];
        const matchesType =
            filters.propertyType === "all" ||
            property.propertyType === filters.propertyType;
        const matchesAmenities =
            filters.amenities.length === 0 ||
            filters.amenities.every((amenity) =>
                property.amenities.includes(amenity)
            );
        const matchesInstantBook = !filters.instantBook || property.instantBook;

        return (
            matchesPrice &&
            matchesType &&
            matchesAmenities &&
            matchesInstantBook
        );
    });

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProperties();
    };

    // const handlePropertyClick = (propertyId: string) => {
    //     router.push(`/properties/${propertyId}`);
    // };

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

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mt-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 w-full md:w-64"
                                    placeholder="Where are you going?"
                                    value={searchParams.location}
                                    onChange={(e) =>
                                        setSearchParams({
                                            ...searchParams,
                                            location: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 w-full md:w-48"
                                    type="date"
                                    value={searchParams.checkIn}
                                    onChange={(e) =>
                                        setSearchParams({
                                            ...searchParams,
                                            checkIn: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 w-full md:w-48"
                                    type="date"
                                    value={searchParams.checkOut}
                                    onChange={(e) =>
                                        setSearchParams({
                                            ...searchParams,
                                            checkOut: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <Button type="submit" className="w-full md:w-auto">
                                <Search className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <Alert className="mt-4" variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>

            {/* Property Listings */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Featured Properties
                    </h2>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setViewMode(
                                    viewMode === "grid" ? "map" : "grid"
                                )
                            }
                        >
                            {viewMode === "grid" ? (
                                <MapIcon className="h-4 w-4" />
                            ) : (
                                <Grid className="h-4 w-4" />
                            )}
                        </Button>

                        {/* Filters Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="mr-2 h-4 w-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filter Properties</SheetTitle>
                                </SheetHeader>
                                <div className="py-6 space-y-6">
                                    {/* Price Range */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium">
                                            Price Range
                                        </h3>
                                        <Slider
                                            min={0}
                                            max={1000}
                                            step={10}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                        />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>

                                    {/* Property Type */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium">
                                            Property Type
                                        </h3>
                                        <Select
                                            value={filters.propertyType}
                                            onValueChange={(value) =>
                                                setFilters({
                                                    ...filters,
                                                    propertyType: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select property type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {propertyTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Amenities */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium">
                                            Amenities
                                        </h3>
                                        <div className="space-y-2">
                                            {amenitiesList.map((amenity) => (
                                                <div
                                                    key={amenity.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={amenity.id}
                                                        checked={filters.amenities.includes(
                                                            amenity.id
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            setFilters({
                                                                ...filters,
                                                                amenities:
                                                                    checked
                                                                        ? [
                                                                              ...filters.amenities,
                                                                              amenity.id,
                                                                          ]
                                                                        : filters.amenities.filter(
                                                                              (
                                                                                  id
                                                                              ) =>
                                                                                  id !==
                                                                                  amenity.id
                                                                          ),
                                                            });
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={amenity.id}
                                                        className="text-sm"
                                                    >
                                                        {amenity.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Instant Book */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="instantBook"
                                            checked={filters.instantBook}
                                            onCheckedChange={(checked) =>
                                                setFilters({
                                                    ...filters,
                                                    instantBook:
                                                        checked as boolean,
                                                })
                                            }
                                        />
                                        <label
                                            htmlFor="instantBook"
                                            className="text-sm bg-gray-100 px-2 py-1 rounded-lg"
                                        >
                                            Instant Book
                                        </label>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Property Grid/Map View */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredProperties.length > 0 ? (
                            filteredProperties.map((property) => (
                                <Link
                                    href={`/property/${property.id}`}
                                    key={property.id}
                                    className="block transition-transform hover:scale-105"
                                >
                                    <Card className="overflow-hidden h-full">
                                        <CardHeader className="p-0">
                                            <div className="relative h-48">
                                                <Image
                                                    src={
                                                        property.images[0] ||
                                                        "/placeholder.png"
                                                    }
                                                    alt={property.title}
                                                    className="object-cover"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (
                                                    max-width: 768px) 50vw, 33vw"
                                                    priority
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg line-clamp-1">
                                                        {property.title}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <MapPin className="inline-block h-4 w-4 mr-1" />
                                                        {property.location}
                                                    </p>
                                                </div>
                                                {property.rating && (
                                                    <Badge variant="secondary">
                                                        ★ {property.rating}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {property.description}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {property.amenities
                                                    .slice(0, 3)
                                                    .map((amenity) => (
                                                        <Badge
                                                            key={amenity}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {amenity}
                                                        </Badge>
                                                    ))}
                                                {property.amenities.length >
                                                    3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {property.amenities
                                                            .length - 3}{" "}
                                                        more
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center p-4 pt-0">
                                            <p className="text-lg font-bold">
                                                ${property.price}
                                                <span className="text-sm font-normal text-gray-500">
                                                    / night
                                                </span>
                                            </p>
                                            {property.instantBook && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 bg-gray-200"
                                                >
                                                    Instant Book
                                                </Badge>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No properties found matching your criteria.
                            </div>
                        )}
                    </div>
                ) : (
                    // Map View (Placeholder)
                    <div className="relative h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <MapIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="mt-2 text-gray-500">
                                Map View Coming Soon
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Host CTA Section */}
            {session?.user?.role !== "HOST" && (
                <div className="bg-primary/5 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Want to become a host?
                            </h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Share your space and earn extra income by
                                hosting on LaLa.
                            </p>
                            <Button
                                className="mt-8"
                                size="lg"
                                onClick={() => router.push("/host")}
                            >
                                Learn More About Hosting
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Host Quick Actions */}
            {session?.user?.role === "HOST" && (
                <div className="fixed bottom-6 right-6">
                    <Button
                        size="lg"
                        className="shadow-lg"
                        onClick={() => router.push("/properties/new")}
                    >
                        + List New Property
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
