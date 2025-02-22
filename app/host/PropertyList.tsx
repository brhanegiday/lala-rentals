"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PropertyForm from "./PropertyForm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PropertyList() {
    const { data: session } = useSession();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingProperty, setEditingProperty] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, [session?.user?.id]);

    const fetchProperties = async () => {
        try {
            const response = await fetch(
                `/api/properties?hostId=${session?.user?.id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data = await response.json();
            setProperties(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (propertyId: string) => {
        if (!confirm("Are you sure you want to delete this property?")) {
            return;
        }

        try {
            const response = await fetch(`/api/properties/${propertyId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete property");
            }

            setProperties(properties.filter((p: any) => p.id !== propertyId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (editingProperty) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
                <PropertyForm
                    property={editingProperty}
                    onClose={() => {
                        setEditingProperty(null);
                        fetchProperties();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Properties</h2>
            <pre>{JSON.stringify(session, null, 3)}</pre>

            {properties.length === 0 ? (
                <p className="text-gray-500">No properties listed yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property: any) => (
                        <div
                            key={property.id}
                            className="border rounded-lg shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="relative h-48">
                                    <Image
                                        src={
                                            property.images[0] ||
                                            "/img/luxurious-beachfront.webp"
                                        }
                                        alt={property.title}
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        priority
                                    />
                                </div>
                                <h3 className="text-xl font-semibold py-5">
                                    {property.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {property.description}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-bold">
                                            Location:
                                        </span>{" "}
                                        {property.location}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-bold">
                                            Price per night:
                                        </span>{" "}
                                        ${property.price}
                                    </p>
                                </div>
                                <div className="mt-4 flex space-x-4 justify-end">
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            setEditingProperty(property)
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleDelete(property.id)
                                        }
                                        variant={"destructive"}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
