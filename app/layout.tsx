import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { QueryProvider } from '@/lib/tanstack-provider';
import { Toaster } from 'react-hot-toast';
import NextAuthProvider from '@/lib/session-provder';
import { Plus_Jakarta_Sans } from 'next/font/google';
const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Academic Dashboard',
  description: 'An academic dashboard'
};
const plus = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800']
});
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-blue-50 min-h-screen">
      <body className={plus.className}>
        <QueryProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </QueryProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
