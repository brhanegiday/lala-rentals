'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleSelectionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const updateUserRole = async (role: 'HOST' | 'RENTER') => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/user/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Redirect based on role
      router.push(role === 'HOST' ? '/host' : '/');
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Choose Your Role</CardTitle>
          <CardDescription className="text-center">
            Select how you want to use LaLa Rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <button
              onClick={() => updateUserRole('RENTER')}
              disabled={isUpdating}
              className="w-full px-4 py-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-medium">I want to rent properties</h3>
              <p className="text-gray-500">Browse and book properties for your stays</p>
            </button>
            
            <button
              onClick={() => updateUserRole('HOST')}
              disabled={isUpdating}
              className="w-full px-4 py-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-medium">I want to host my property</h3>
              <p className="text-gray-500">List and manage your properties for rent</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}