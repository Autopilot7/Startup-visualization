import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { endpoints } from "@/app/utils/apis"
import { JWT } from "next-auth/jwt"
import { signInSchema } from "@/lib/zod"

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
const providers = [
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {

      // logic to verify if the user exists
      if (!credentials) {
          throw new Error('No credentials provided');
      }

      const { email, password } = await signInSchema.parseAsync(credentials)
      
      const res = await fetch(endpoints.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password
          }),
      });

      const user: User = await res.json();
  
      if (res.ok && user) {
          return {
          ...user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          };
      }

      if (!user) {
        // No user found, so this is their first attempt to login
        // Optionally, this is also the place you could do a user registration
        throw new Error("Invalid credentials.")
      }

      // return user object with their profile data
      return user
    },
  }),
]

const callbacks = {
  async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      }
    
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
    
      return await refreshAccessToken(token);
  },
  async session({ session, token }: { session: any, token: JWT }) {
    // Attach the access token to the session
    session.user = {
      ...session.user,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
    return session;
  },
  async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
    return baseUrl
  },
}


async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(endpoints.refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    const text = await response.text(); // Use text first to debug malformed JSON
    console.log('Response Body:', text);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = text ? JSON.parse(text) : null;
    if (!data || !data.access) {
      throw new Error('Invalid response format or missing access token');
    }

    return {
      ...token,
      accessToken: data.access,
      refreshToken: data.refresh || token.refreshToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authConfig = {
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: callbacks
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
