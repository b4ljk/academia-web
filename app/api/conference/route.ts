import { db } from '@/lib/db';
import { conference, speakers } from '@/lib/schema';
import { conferenceSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const data = await db.query.conference.findMany();

  return NextResponse.json({ data });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = conferenceSchema.parse(body);

  console.log(payload);
  const data = await db.insert(conference).values(payload).returning({
    id: conference.id
  });

  return NextResponse.json(data?.[0]);
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const payload = conferenceSchema.parse(body);

  console.log(payload);

  if (!payload.id)
    return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const data = await db
    .update(conference)
    .set(payload)
    .where(eq(conference.id, payload.id));
  return NextResponse.json({
    message: 'Conference updated'
  });
};
