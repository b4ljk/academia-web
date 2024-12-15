import { db } from '@/lib/db';
import { registered_user } from '@/lib/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const data = await db.query.registered_user.findMany({
    where: eq(registered_user.conferenceId, parseInt(params.id, 10))
  });

  return NextResponse.json(data);
};
