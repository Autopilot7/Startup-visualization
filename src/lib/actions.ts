'use server';
 
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  try {
    await signIn('credentials', {
        ...credentials,
        redirect: true,
        redirectTo: '/',
      });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }

    throw error;
  }
}

export async function handleSignOut() {
    await signOut();
  }