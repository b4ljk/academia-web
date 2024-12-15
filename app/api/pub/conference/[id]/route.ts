import { db } from '@/lib/db';
import { speakers } from '@/lib/schema';
// import { speakers } from '@/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = parseInt(params.id, 10);

  const data = await db.query.conference.findFirst({
    where: (conference, { eq }) => eq(conference.id, id),
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
