import { db } from '@/lib/db';
import { organizers } from '@/lib/schema';
import { organizerSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const payload = organizerSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  const data = await db.insert(organizers).values(payload);
  return NextResponse.json(data);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.query.organizers.findMany({
    where: eq(organizers.conferenceId, parseInt(id))
  });
  return NextResponse.json(data);
};

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  await db.delete(organizers).where(eq(organizers.id, parseInt(id)));

  return NextResponse.json({ id });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const payload = organizerSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  const data = await db
    .update(organizers)
    .set(payload)
    .where(eq(organizers.id, payload.id));
  return NextResponse.json(data);
};
