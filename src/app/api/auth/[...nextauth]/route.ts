import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DefaultJWT, JWT } from 'next-auth/jwt';
import { endpoints } from '@/app/utils/apis';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        const res = await fetch(endpoints.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          }),
        });

        const user = await res.json();
  
        if (res.ok && user) {
          return {
            ...user,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          };
        }
      
        throw new Error('Invalid credentials');
      }      
    }),
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  callbacks: {
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
  },
});

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
      
export { handler as GET, handler as POST };