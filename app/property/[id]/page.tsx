"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface Property {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    rating?: number;
    reviews?: number;
    amenities: string[];
    images: string[];
    host: {
        id: string;
        name: string;
        image: string | null;
        responseTime?: string;
        joinedDate?: string;
    };
    instantBook?: boolean;
}

const PropertyDetails = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<{
        from: Date;
        to: Date | undefined;
    }>({
        from: new Date(),
        to: undefined,
    });

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/properties/${params.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch property details');
                }

                const data = await response.json();
                setProperty(data);
            } catch (err) {
                console.error('Error fetching property:', err);
                setError('Failed to load property details');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPropertyDetails();
        }
    }, [params.id]);

    const handleBooking = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (!dateRange.from || !dateRange.to) {
            setError('Please select check-in and check-out dates');
            return;
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: property?.id,
                    checkIn: dateRange.from,
                    checkOut: dateRange.to,
                    totalPrice: property?.price
                        ? property.price * 
                          Math.ceil(
                            (dateRange.to.getTime() - dateRange.from.getTime()) / 
                            (1000 * 60 * 60 * 24)
                          )
                        : 0,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create booking');
            }

            const booking = await response.json();
            router.push(`/bookings/${booking.id}`);
        } catch (err) {
            console.error('Error creating booking:', err);
            setError(err instanceof Error ? err.message : 'Failed to create booking');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            <Skeleton className="h-96 w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-48 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <Skeleton className="h-[500px] w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        {error || 'Property not found'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="col-span-2 relative h-96">
                            <Image
                                src={property.images[0] || '/placeholder.jpg'}
                                alt={property.title}
                                className="rounded-lg object-cover"
                                fill
                                priority
                            />
                        </div>
                        {property.images.slice(1, 3).map((image, index) => (
                            <div key={index} className="relative h-48">
                                <Image
                                    src={image}
                                    alt={`${property.title} ${index + 2}`}
                                    className="rounded-lg object-cover"
                                    fill
                                />
                            </div>
                        ))}
                    </div>

                    {/* Property Info */}
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {property.title}
                                </h1>
                                <p className="text-gray-500">{property.location}</p>
                            </div>
                            {property.rating && (
                                <Badge variant="secondary" className="text-lg">
                                    ★ {property.rating}
                                    {property.reviews && ` (${property.reviews} reviews)`}
                                </Badge>
                            )}
                        </div>

                        <Tabs defaultValue="about" className="mt-6">
                            <TabsList>
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                            </TabsList>
                            <TabsContent value="about" className="mt-4">
                                <p className="text-gray-600">{property.description}</p>
                            </TabsContent>
                            <TabsContent value="amenities" className="mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {property.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-gray-600">
                                                {amenity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <p className="text-2xl font-bold">
                                    ${property.price}{" "}
                                    <span className="text-base font-normal text-gray-500">
                                        / night
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Check-in - Check-out
                                    </label>
                                    <CalendarComponent
                                        mode="range"
                                        selected={{
                                            from: dateRange.from,
                                            to: dateRange.to,
                                        }}
                                        onSelect={(range: any) => setDateRange(range)}
                                        className="rounded-md border"
                                        disabled={(date) => date < new Date()}
                                    />
                                </div>

                                {error && (
                                    <Alert variant="destructive" className="mt-2">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button 
                                    className="w-full" 
                                    onClick={handleBooking}
                                    disabled={!dateRange.from || !dateRange.to}
                                >
                                    Book Now
                                </Button>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage
                                            src={property.host.image || ''}
                                            alt={property.host.name}
                                        />
                                        <AvatarFallback>
                                            {property.host.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            Hosted by {property.host.name}
                                        </p>
                                        {property.host.responseTime && (
                                            <p className="text-sm text-gray-500">
                                                Responds {property.host.responseTime}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;