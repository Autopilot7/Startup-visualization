// src/app/login/page.tsx
'use client';

import Image from 'next/image';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { endpoints } from '@/app/utils/apis';

export default function LoginPage() {
  // State for form fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // State for handling errors and loading
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);

  // Next.js router for navigation
  const router = useRouter();

  // Authentication context to handle login
  const { login } = useContext(AuthContext);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior
    setErrorMessage(''); // Reset any existing error messages
    setIsPending(true); // Indicate that the login process has started

    try {
      // Attempt to log in the user by calling the login API route
      const response = await axios.post(endpoints.login, { email, password });
      const data = response.data;
      console.log('Login successful:', data);

      // Check if the access token is received
      if (!data.access) {
        setErrorMessage('No access token received.');
        toast.error('No access token received.');
      } else {
        // Update authentication context with the token
        login(data.access);

        // Show a success toast notification
        toast.success('Logged in successfully!');

        // Navigate to the dashboard
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err.response.status);

      // Extract and set the error message from the response
      if (err.response.status === 401) {
        setErrorMessage(err.response.data.detail);
        toast.error(err.response.data.detail);
      } else {
        setErrorMessage('An error occurred. Please try again.');
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsPending(false); // Reset the loading state
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Elab"
            src="/vinuni.png"
            className="mx-auto h-10 w-auto"
            width={100}
            height={100}
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isPending ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Sign in as admin'}
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success('Continuing as guest');
                  router.push('/');
                }}
                className="mt-3 flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-200"
                disabled={isPending}
              >
                Sign in as guest
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center space-x-2 text-red-500">
                <ExclamationCircleIcon className="h-5 w-5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
