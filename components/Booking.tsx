"use client";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BookingModalProps {
    isOpen: boolean;       
    onClose: () => void;  
    property: any;       
}
const BookingModal = ({ isOpen, onClose, property }: BookingModalProps) => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        guests: 1,
        message: "",
    });

    const handleSubmit = async () => {
        // Handle booking submission
        // API call would go here
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Complete your booking</DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Provide booking details"
                            : "Review and confirm"}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="guests">Number of guests</Label>
                            <Input
                                id="guests"
                                type="number"
                                min="1"
                                value={bookingData.guests}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        guests: parseInt(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message to host</Label>
                            <Textarea
                                id="message"
                                placeholder="Introduce yourself and share why you're coming..."
                                value={bookingData.message}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        message: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <Button className="w-full" onClick={() => setStep(2)}>
                            Continue
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h3 className="font-medium">Booking Summary</h3>
                            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                                <p>
                                    <span className="font-medium">Dates:</span>{" "}
                                    [Check-in] - [Check-out]
                                </p>
                                <p>
                                    <span className="font-medium">Guests:</span>{" "}
                                    {bookingData.guests}
                                </p>
                                <p>
                                    <span className="font-medium">Total:</span>{" "}
                                    ${property?.price * 3}
                                </p>{" "}
                                {/* Example: 3 nights */}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button className="flex-1" onClick={handleSubmit}>
                                Confirm Booking
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
