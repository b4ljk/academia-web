import { db } from '@/lib/db';
import { registered_user } from '@/lib/schema';
import { registeredUserSchema } from '@/lib/schema-types';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fromError } from 'zod-validation-error';
import { z } from 'zod';

export const POST = async (req: NextRequest) => {
  try {
    const json = await req.json();
    const body = registeredUserSchema
      .extend({
        image_name: z.string(),
        conferenceId: z.number()
      })
      .parse(json);

    const fileName = uuidv4();
    const fileKey = 'profile/' + fileName + body.image_name;

    const s3Configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET || ''
      },
      region: process.env.AWS_REGION
    };

    const s3 = new S3Client(s3Configuration);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PUBLIC || '',
      Key: fileKey || '',
      ContentType: 'image/png'
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
    const viewUrl = `https://d2fdkqqxx3jf3.cloudfront.net/${fileKey}`;

    const data = await db.insert(registered_user).values({
      ...body,
      profile_picture: viewUrl
    });

    return NextResponse.json({ url: url, viewUrl: viewUrl });
  } catch (e) {
    const validationError = fromError(e).toString();
    console.log(validationError);
    return NextResponse.json(validationError, { status: 400 });
  }
};

export const GET = async (req: NextRequest) => {
  const data = await db.query.registered_user.findMany();
  return NextResponse.json(data);
};
