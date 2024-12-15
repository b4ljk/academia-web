import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const data = await db.query.conference.findMany();

  return NextResponse.json(data);
}
