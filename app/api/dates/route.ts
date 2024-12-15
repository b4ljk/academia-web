import { db } from '@/lib/db';
import { important_dates } from '@/lib/schema';

import { importantDatesSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.query.important_dates.findMany({
    where: eq(important_dates.conferenceId, parseInt(id))
  });

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const payload = importantDatesSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.conferenceId) {
    return NextResponse.json(
      { error: 'html and conferenceId are required' },
      { status: 400 }
    );
  }

  const data = await db.insert(important_dates).values(payload);

  return NextResponse.json({ message: 'Successfully created call for paper' });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const payload = importantDatesSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db
    .update(important_dates)
    .set(payload)
    .where(eq(important_dates.id, payload.id));

  return NextResponse.json(data);
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db
    .delete(important_dates)
    .where(eq(important_dates.id, parseInt(id)));
  return NextResponse.json(data);
};
