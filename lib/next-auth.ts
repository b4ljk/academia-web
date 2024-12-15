import { type GetServerSidePropsContext } from 'next';
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { usersType } from './schema-types';
import { getUserFromDb } from '@/utils/password';

// type UserRole = "ADMIN" | "USER" | "COMPANY";

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & User;
  }

  interface User extends usersType {}
}
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    // 24 hours
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          user: user
        };
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: token.user
        } as any;
      }
      return session;
    }
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req): Promise<any | null> {
        console.log('credentials', credentials);
        console.log('credentials', credentials);
        console.log('credentials', credentials);
        console.log('credentials', credentials);
        console.log('credentials', credentials);
        console.log('credentials', credentials);
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Имэйл эсвэл нууц үг хоосон байна', {
            cause: 'NOT_FOUND'
          });
        }
        const username = credentials.email.toLowerCase();

        const userData = await getUserFromDb(username, credentials.password);

        if (!userData) {
          return null;
        }

        return { ...userData, password: undefined };
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
};
