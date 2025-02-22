"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyList from "./PropertyList";
import BookingRequests from "./BookingRequests";
import PropertyForm from "./PropertyForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HostDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("properties");

    // useEffect(() => {
    //   if (!session?.user?.role || session.user.role !== 'HOST') {
    //     router.push('/');
    //   }
    // }, [session, router]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Host Dashboard</h1>
            <p className="text-gray-500 pt-2 pb-5">
                Manage your properties and bookings
            </p>

            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("properties")}
                            className={`${
                                activeTab === "properties"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            My Properties
                        </button>
                        <button
                            onClick={() => setActiveTab("bookings")}
                            className={`${
                                activeTab === "bookings"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Booking Requests
                        </button>
                        <button
                            onClick={() => setActiveTab("add")}
                            className={`${
                                activeTab === "add"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Add Property
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === "properties" && <PropertyList />}
            {activeTab === "bookings" && <BookingRequests />}
            {activeTab === "add" && <PropertyForm />}
        </div>
    );
}
