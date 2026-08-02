import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import DiscordProvider from 'next-auth/providers/discord';
// import SteamProvider from 'next-auth/providers/steam'; // Example: use Steam OIDC if available
import { prisma } from '../prisma';
import { verify } from '@node-rs/argon2';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'database',
    // When using database sessions, NextAuth stores sessions in the Sessions table
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@domain.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.passwordHash) return null;
        try {
          const valid = await verify(user.passwordHash, credentials.password);
          if (!valid) return null;
          // sanitize user object returned to NextAuth
          const { passwordHash, ...safeUser } = user as any;
          return safeUser as any;
        } catch (err) {
          console.error('Password verify error', err);
          return null;
        }
      },
    }),

    // Add OAuth providers as needed, configure env vars
    // DiscordProvider({ clientId: process.env.DISCORD_CLIENT_ID!, clientSecret: process.env.DISCORD_CLIENT_SECRET! }),
    // SteamProvider({ clientId: process.env.STEAM_CLIENT_ID!, clientSecret: process.env.STEAM_CLIENT_SECRET! }),
  ],
  callbacks: {
    async session({ session, user }) {
      // attach role and userId to session for easy access
      if (user) {
        (session as any).userId = (user as any).id;
        (session as any).role = (user as any).role;
      }
      return session;
    },
    async signIn({ user }) {
      // Optionally prevent sign-in for certain roles or states
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    // newUser: '/welcome',
  },
  debug: process.env.NODE_ENV !== 'production',
};

export default NextAuth(authOptions);
