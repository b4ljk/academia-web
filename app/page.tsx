import { LoaderCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';

  redirect('/dashboard');

  return (
    <main className="min-h-screen w-full flex justify-center items-center">
      <LoaderCircle className="w-12 h-12 animate-spin" />
    </main>
  );
}
