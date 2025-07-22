'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { getYearBySlug } from '@/sanity/sanity-utils';
import Image from 'next/image';
import React from 'react';

type Props = {
    params: Promise<{ year: string }>;
};

export default function DashboardPage({ params }: Props) {
    const unwrappedParams = React.use(params);
    const { user, isLoading, login, logout } = useAuth();
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [yearData, setYearData] = useState<{ _id: string } | null>(null);

    useEffect(() => {
        if (unwrappedParams.year) {
            getYearBySlug(unwrappedParams.year).then(setYearData);
        }
    }, [unwrappedParams.year]);

 const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const formData = new FormData(e.currentTarget);

    if (!yearData) {
      setError("Could not determine the event year. Please try again later.");
      return;
    }
    formData.append('yearId', yearData._id);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData, // Send FormData directly
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setIsSigningUp(false);
      } else {
        setError(data.message || 'An error occurred during signup.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const formData = new FormData(e.currentTarget);
    const login_name = formData.get('login_name') as string;
    const password = formData.get('password') as string;

    try {
      const data = await login(login_name, password);
      if (data.error) {
        setError(data.error);
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  // Custom Navbar for Dashboard
  const DashboardNav = () => (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          {user && (
            <div className="relative">
              <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                <Image
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.pictureURL || '/default-avatar.png'} // Provide a default avatar
                  alt="User avatar"
                  width={32}
                  height={32}
                />
              </button>
              {/* Dropdown would go here */}
              <button onClick={() => logout()} className="ml-4 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <DashboardNav />
      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {!user ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
              {isSigningUp ? (
                <>
                  <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input name="name" type="text" required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Login Name</label>
                      <input name="login_name" type="text" required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Password</label>
                      <input name="password" type="password" required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Email (Optional)</label>
                      <input name="email" type="email" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium">Role (e.g., Researcher) (Optional)</label>
                      <input name="role" type="text" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium">Institute (Optional)</label>
                      <input name="institute" type="text" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Profile Picture (Optional)</label>
                      <input name="picture" type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Sign Up</button>
                  </form>
                  <p className="text-center text-sm">
                    Already have an account?{' '}
                    <button onClick={() => setIsSigningUp(false)} className="font-medium text-blue-600 hover:underline">Log In</button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center">Log In</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Login Name</label>
                      <input name="login_name" type="text" required className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Password</label>
                      <input name="password" type="password" required className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Log In</button>
                  </form>
                  <p className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <button onClick={() => setIsSigningUp(true)} className="font-medium text-blue-600 hover:underline">Sign Up</button>
                  </p>
                </>
              )}
              {error && <p className="text-center text-red-500">{error}</p>}
              {message && <p className="text-center text-green-500">{message}</p>}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">Welcome, {user.name}!</h2>
            <p>This is your dashboard. More features will be added here soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}