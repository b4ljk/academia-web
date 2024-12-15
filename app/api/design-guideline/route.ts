import { db } from '@/lib/db';
import { design_guidelines } from '@/lib/schema';
import { designGuidelinesSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data =
    (await db.query.design_guidelines.findFirst({
      where: eq(design_guidelines.conferenceId, parseInt(id))
    })) ?? '';

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);
  const payload = designGuidelinesSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.conferenceId) {
    return NextResponse.json(
      { error: 'html and conferenceId are required' },
      { status: 400 }
    );
  }

  const previousInput = await db.query.design_guidelines.findFirst({
    where: eq(design_guidelines.conferenceId, payload.conferenceId)
  });

  if (previousInput?.id) {
    const data = await db
      .update(design_guidelines)
      .set(payload)
      .where(eq(design_guidelines.id, previousInput.id));
    return NextResponse.json({
      message: 'Successfully changed style guidelines'
    });
  }

  const data = await db.insert(design_guidelines).values(payload);

  return NextResponse.json({
    message: 'Successfully created style guidelines'
  });
};
