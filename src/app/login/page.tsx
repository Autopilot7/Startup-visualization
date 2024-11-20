"use client";

import Image from 'next/image'
import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/lib/actions';
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
// import { toast } from "sonner"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const [errorMessage, formAction, isPending] = useActionState(
      authenticate,
      undefined,
    );
    
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
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action={formAction} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    formNoValidate={false}
                    aria-disabled={isPending}
                  >
                    Sign in as admin
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="mt-3 flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm/6 font-semibold text-indigo-600 shadow-sm hover:bg-gray-200"
                    aria-disabled={isPending}
                  >
                    Sign in as guest
                  </button>
                </div>
                {errorMessage && (
                  <>
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </>
                )}
              </form>
            </div>
          </div>
      </>
    )
}
