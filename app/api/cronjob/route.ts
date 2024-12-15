import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cronjob } from '@/lib/schema';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const data = await db.query.conference.findMany();

  //   console.log(payload);
  const inserted = await db.insert(cronjob).values({
    name: new Date().toISOString()
    //   lastRun: new Date()
  });

  return NextResponse.json(inserted);
}
