import { db } from '@/lib/db';
import { submission } from '@/lib/schema';
import { submissionSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data =
    (await db.query.submission.findFirst({
      where: eq(submission.conferenceId, parseInt(id))
    })) ?? '';

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);
  const payload = submissionSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.conferenceId) {
    return NextResponse.json(
      { error: 'html and conferenceId are required' },
      { status: 400 }
    );
  }

  const previousInput = await db.query.submission.findFirst({
    where: eq(submission.conferenceId, payload.conferenceId)
  });

  if (previousInput?.id) {
    const data = await db
      .update(submission)
      .set(payload)
      .where(eq(submission.id, previousInput.id));
    return NextResponse.json({
      message: 'Successfully changed call for submission'
    });
  }

  const data = await db.insert(submission).values(payload);

  return NextResponse.json({
    message: 'Successfully created call for submission'
  });
};
