import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { about } from '../../../../lib/schema';

export const dynamic = 'force-dynamic';
export const GET = async (req: NextRequest) => {
  const data = await db.query.conference.findFirst({
    where: (conference, { eq }) => eq(conference.isDefault, true),
    with: {
      speakers: true,
      about: true,
      faq: true,
      call_for_paper: true,
      committees: {
        with: {
          committee_members: true
        }
      },
      important_dates: true,
      organizers: true,
      registration: true,
      venue: true,
      submission: true,
      agenda: true
    }
  });

  return NextResponse.json(data);
};
