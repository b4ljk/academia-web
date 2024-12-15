import { db } from '@/lib/db';
import { committees } from '@/lib/schema';
import { committeeSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);

  const payload = committeeSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  const data = await db.insert(committees).values(payload);
  return NextResponse.json(data);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.query.committees.findMany({
    with: {
      committee_members: true
    },
    where: eq(committees.conferenceId, parseInt(id))
  });
  return NextResponse.json(data);
};

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  await db.delete(committees).where(eq(committees.id, parseInt(id)));

  return NextResponse.json({ id });
};
