import { db } from '@/lib/db';
import { speakers } from '@/lib/schema';
// import { speakers } from '@/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  const data = await db.query.conference.findMany({
    columns: {
      id: true,
      name: true,
      location: true,
      city: true,
      country: true
    }
  });

  return NextResponse.json(data);
};
