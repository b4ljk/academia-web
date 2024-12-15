import { db } from '@/lib/db';
import { design_guidelines } from '@/lib/schema';
import { designGuidelinesSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  const data = await db.query.design_guidelines.findMany();
  return NextResponse.json(data);
};
