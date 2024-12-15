import { db } from '@/lib/db';
import { about } from '@/lib/schema';
import { aboutSchema, conferenceSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data =
    (await db.query.about.findFirst({
      where: eq(about.conferenceId, parseInt(id))
    })) ?? '';

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = aboutSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.conferenceId) {
    return NextResponse.json(
      { error: 'html and conferenceId are required' },
      { status: 400 }
    );
  }

  const previousInput = await db.query.about.findFirst({
    where: eq(about.conferenceId, payload.conferenceId)
  });

  if (previousInput?.id) {
    const data = await db
      .update(about)
      .set(payload)
      .where(eq(about.id, previousInput.id));
    return NextResponse.json({ message: 'Successfully changed about' });
  }

  const data = await db.insert(about).values(payload);

  return NextResponse.json({ message: 'Successfully changed about' });
};
