import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { year: string } }
) => {
  const year = parseInt(params.year, 10);
  const date = new Date(year, 0, 1);
  const next = new Date(year + 1, 0, 1);
  const data = await db.query.conference.findMany({
    where: (conference, { between }) =>
      between(conference.start, date.toISOString(), next.toISOString()),
    with: {
      speakers: true
    }
  });

  return NextResponse.json(data);
};
