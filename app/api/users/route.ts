import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { usersSchema } from '@/lib/schema-types';
import { saltAndHashPassword } from '@/utils/password';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const json = await req.json();
  const body = usersSchema.parse(json);

  const user = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  });

  if (user) {
    return NextResponse.json(
      {
        message: 'User exists'
      },
      {
        status: 400
      }
    );
  }

  const password = await saltAndHashPassword(body.password);

  const response = await db
    .insert(users)
    .values({ ...body, password: password });
  return NextResponse.json(response);
};
