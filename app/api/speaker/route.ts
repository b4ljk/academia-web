import { db } from '@/lib/db';
import { speakers } from '@/lib/schema';
import { speakerSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const payload = speakerSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  const data = await db.insert(speakers).values(payload);
  return NextResponse.json(data);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.query.speakers.findMany({
    where: eq(speakers.conferenceId, parseInt(id))
  });
  return NextResponse.json(data);
};

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  await db.delete(speakers).where(eq(speakers.id, parseInt(id)));

  return NextResponse.json({ id });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const payload = speakerSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  const data = await db
    .update(speakers)
    .set(payload)
    .where(eq(speakers.id, payload.id));
  return NextResponse.json(data);
};
