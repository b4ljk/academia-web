import { db } from "@/lib/db";
import { conference, speakers } from "@/lib/schema";
import { speakerSchema } from "@/lib/schema-types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const data = await db.query.speakers.findMany();

  return NextResponse.json({ data });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = speakerSchema.parse(body);

  const data = await db.insert(speakers).values(payload);
  return NextResponse.json({ data });
};
