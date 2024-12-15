import { db } from '@/lib/db';
import { committees, conference } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: number } }
) => {
  const id = z.number().parse(Number(params.id));
  console.log(id);
  return NextResponse.json(id);
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: number } }
) => {
  try {
    const id = z.number().parse(Number(params.id));

    const committeesDeleted = await db
      .delete(committees)
      .where(eq(committees.conferenceId, id));

    const deleted = await db.delete(conference).where(eq(conference.id, id));

    console.log(deleted);

    return NextResponse.json(id);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
};
