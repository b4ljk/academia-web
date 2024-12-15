import { db } from '@/lib/db';
import { committee_members } from '@/lib/schema';
import { committeeMembersSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const payload = committeeMembersSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  const data = await db.insert(committee_members).values(payload);
  return NextResponse.json(data);
};

export const DELETE = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  await db
    .delete(committee_members)
    .where(eq(committee_members.id, parseInt(id)));

  return NextResponse.json({ id });
};
