// import { authOptions as options } from "@/lib/authSettings";
import { authOptions as options } from '@/lib/next-auth';
import NextAuth, { AuthOptions } from 'next-auth';

const handler = NextAuth(options);

export { handler as GET, handler as POST };
