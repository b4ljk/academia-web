import { db } from '@/lib/db';
import { design_guidelines } from '@/lib/schema';
import { designGuidelinesSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: number } }
) => {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data =
    (await db.query.design_guidelines.findFirst({
      where: eq(design_guidelines.conferenceId, id)
    })) ?? '';

  return NextResponse.json(data);
};
