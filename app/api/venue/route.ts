import { db } from '@/lib/db';
import { venue } from '@/lib/schema';
import { venueSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data =
    (await db.query.venue.findFirst({
      where: eq(venue.conferenceId, parseInt(id))
    })) ?? '';

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);
  const payload = venueSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.conferenceId) {
    return NextResponse.json(
      { error: 'html and conferenceId are required' },
      { status: 400 }
    );
  }

  const previousInput = await db.query.venue.findFirst({
    where: eq(venue.conferenceId, payload.conferenceId)
  });

  if (previousInput?.id) {
    const data = await db
      .update(venue)
      .set(payload)
      .where(eq(venue.id, previousInput.id));
    return NextResponse.json({
      message: 'Successfully changed call for venue'
    });
  }

  const data = await db.insert(venue).values(payload);

  return NextResponse.json({
    message: 'Successfully created call for venue'
  });
};
