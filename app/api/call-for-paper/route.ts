import { db } from '@/lib/db';
import { call_for_paper } from '@/lib/schema';
import { callForPaperSchema, conferenceSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data =
    (await db.query.call_for_paper.findFirst({
      where: eq(call_for_paper.conferenceId, parseInt(id))
    })) ?? '';

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);
  const payload = callForPaperSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.conferenceId) {
    return NextResponse.json(
      { error: 'html and conferenceId are required' },
      { status: 400 }
    );
  }

  const previousInput = await db.query.call_for_paper.findFirst({
    where: eq(call_for_paper.conferenceId, payload.conferenceId)
  });

  if (previousInput?.id) {
    const data = await db
      .update(call_for_paper)
      .set(payload)
      .where(eq(call_for_paper.id, previousInput.id));
    return NextResponse.json({
      message: 'Successfully changed call for paper'
    });
  }

  const data = await db.insert(call_for_paper).values(payload);

  return NextResponse.json({ message: 'Successfully created call for paper' });
};
