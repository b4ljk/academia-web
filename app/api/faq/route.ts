import { db } from '@/lib/db';
import { faq } from '@/lib/schema';
import { faqSchema } from '@/lib/schema-types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  console.log(body);

  const payload = faqSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  const data = await db.insert(faq).values(payload);
  return NextResponse.json(data);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.query.faq.findMany({
    where: eq(faq.conferenceId, parseInt(id))
  });
  return NextResponse.json(data);
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const payload = faqSchema.parse({
    ...body,
    conferenceId: parseInt(body.conferenceId)
  });

  if (!payload.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.update(faq).set(payload).where(eq(faq.id, payload.id));

  return NextResponse.json(data);
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const data = await db.delete(faq).where(eq(faq.id, parseInt(id)));
  return NextResponse.json(data);
};
