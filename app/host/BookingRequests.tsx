"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Booking = {
    id: string;
    checkIn: string;
    checkOut: string;
    status: "PENDING" | "CONFIRMED" | "CANCELED";
    property: {
        id: string;
        title: string;
        pricePerNight: number;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
    totalPrice: number;
};

export default function BookingRequests() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "ALL" | "PENDING" | "CONFIRMED" | "CANCELED"
    >("ALL");

    useEffect(() => {
        fetchBookings();
    }, [session?.user?.id]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(
                `/api/bookings?hostId=${session?.user?.id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }
            const data = await response.json();
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleBookingAction = async (
        bookingId: string,
        action: "confirm" | "cancel"
    ) => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: action === "confirm" ? "CONFIRMED" : "CANCELED",
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} booking`);
            }

            // Refresh bookings list
            fetchBookings();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "CANCELED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredBookings = bookings.filter((booking) =>
        statusFilter === "ALL" ? true : booking.status === statusFilter
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Booking Requests</h2>
                <div className="flex space-x-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="ALL">All Bookings</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELED">Canceled</option>
                    </select>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No booking requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="border rounded-lg shadow-sm p-6 bg-white"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {booking.property.title}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Guest Information
                                            </p>
                                            <p className="font-medium">
                                                {booking.user.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {booking.user.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Booking Details
                                            </p>
                                            <p className="font-medium">
                                                Check-in:{" "}
                                                {new Date(
                                                    booking.checkIn
                                                ).toLocaleDateString()}
                                            </p>
                                            <p className="font-medium">
                                                Check-out:{" "}
                                                {new Date(
                                                    booking.checkOut
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total Price
                                        </p>
                                        <p className="text-lg font-semibold">
                                            ${booking.totalPrice}
                                        </p>
                                    </div>
                                </div>

                                {booking.status === "PENDING" && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleBookingAction(
                                                    booking.id,
                                                    "confirm"
                                                )
                                            }
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleBookingAction(
                                                    booking.id,
                                                    "cancel"
                                                )
                                            }
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
