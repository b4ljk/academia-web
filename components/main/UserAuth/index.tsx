'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!email || !password) return toast.error('Please fill in all fields');
    if (isLoading) return;
    setIsLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    setIsLoading(false);

    if (result?.error) {
      return toast.error(result.error);
    }
    router.push('/dashboard');
    // get input data from form
  }

  React.useEffect(() => {
    if (session) {
      redirect('/dashboard');
    }
  }, [session]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              id="password"
              placeholder="*******"
              type="password"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
        <Button disabled={isLoading} className="w-full mt-4">
          {isLoading && <LoaderCircle className="mr-2 animate-spin" />}
          Sign In with Email
        </Button>
      </form>
    </div>
  );
}
