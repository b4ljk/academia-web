import { db } from '@/lib/db';
import { conference } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const payload = z
    .object({
      id: z.number()
    })
    .parse({
      id: parseInt(body.id, 10)
    });

  const data = db.transaction(async (tx) => {
    await tx.update(conference).set({
      isDefault: false
    });

    await tx
      .update(conference)
      .set({
        isDefault: true
      })
      .where(eq(conference.id, payload.id));
  });

  return NextResponse.json(data);
};
