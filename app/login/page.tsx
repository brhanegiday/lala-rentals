// "use client";

// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
// } from "@/components/ui/card";
// import Image from "next/image";
// import Link from "next/link";

// const LoginPage = () => {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
//                 <CardHeader className="text-center">
//                     <Link href={"/"}>
//                         <Image
//                             src="/img/hotel-3.png" // Replace with your actual logo
//                             alt="LaLa Logo"
//                             width={600}
//                             height={600}
//                             className="mx-auto mb-2 rounded-lg"
//                         />
//                     </Link>
//                     <CardTitle className="text-2xl font-bold">
//                         Welcome to LaLa
//                     </CardTitle>
//                     <CardDescription>
//                         Please sign in to continue
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex flex-col gap-4">
//                         <Button
//                             onClick={() =>
//                                 signIn("google", { callbackUrl: "/" })
//                             }
//                             className="w-full flex items-center justify-center gap-2"
//                         >
//                             <svg className="w-5 h-5" viewBox="0 0 24 24">
//                                 <path
//                                     fill="currentColor"
//                                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                 />
//                                 <path
//                                     fill="currentColor"
//                                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                 />
//                                 <path
//                                     fill="currentColor"
//                                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                 />
//                                 <path
//                                     fill="currentColor"
//                                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                 />
//                             </svg>
//                             Continue with Google
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default LoginPage;

"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [role, setRole] = useState<"HOST" | "RENTER">("RENTER");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.push(callbackUrl);
        }
    }, [session, router, callbackUrl]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", {
                callbackUrl: "/auth/role-selection",
                role: role,
            });
        } catch (error) {
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href={"/"}>
                        <Image
                            src="/img/hotel-3.png"
                            alt="LaLa Logo"
                            width={600}
                            height={600}
                            className="mx-auto mb-2 rounded-lg"
                        />
                    </Link>
                    <CardTitle className="text-2xl font-bold">
                        Welcome to LaLa
                    </CardTitle>
                    <CardDescription>
                        Please sign in to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setRole("RENTER")}
                                    className={`px-4 py-2 rounded-md ${
                                        role === "RENTER"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    I want to rent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("HOST")}
                                    className={`px-4 py-2 rounded-md ${
                                        role === "HOST"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    I want to host
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                        />
                                    </svg>
                                    Continue with Google
                                </div>
                            )}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
