import { db } from '@/lib/db';
import { submission_file } from '@/lib/schema';
import { submissionFileSchema } from '@/lib/schema-types';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: number } }
) => {
  try {
    const id = z.number().parse(Number(params.id));

    const body = await request.json();
    const payload = submissionFileSchema.parse(body);

    const fileName = uuidv4();
    const fileKey = 'submissions/' + fileName + payload.paper;

    const s3Configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET || ''
      },
      region: process.env.AWS_REGION
    };

    const s3 = new S3Client(s3Configuration);
    // word document or pdf
    let contentType = payload?.paper?.includes('.doc')
      ? 'application/msword'
      : 'application/pdf';

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PUBLIC || '',
      Key: fileKey || '',
      ContentType: contentType
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
    const viewUrl = `https://d2fdkqqxx3jf3.cloudfront.net/${fileKey}`;

    const data = await db.insert(submission_file).values({
      ...payload,
      paper: viewUrl,
      conferenceId: payload?.conferenceId || id
    });

    return NextResponse.json({
      url: url,
      viewUrl: viewUrl
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: number } }
) => {
  try {
    const id = z.number().parse(Number(params.id));
    // list of all files in a bucket
    const s3Configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET || ''
      },
      region: process.env.AWS_REGION
    };

    const s3 = new S3Client(s3Configuration);

    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_PUBLIC || '',
        Prefix: 'submissions/'
      })
    );

    const contents = list.Contents || [];

    const data = await db.query.submission_file.findMany({
      where: (submission_file, { eq }) => eq(submission_file.conferenceId, id)
    });

    const returnable = data.map((d) => {
      const file = contents.find((c) => d.paper?.includes(c.Key || ''));
      return {
        ...d,
        dateModified: file?.LastModified
      };
    });

    // sort by modification date
    returnable.sort((a, b) => {
      if (a.dateModified && b.dateModified) {
        return a.dateModified > b.dateModified ? -1 : 1;
      }
      return 0;
    });

    return NextResponse.json(returnable);
  } catch (e) {
    console.log(e);
    return NextResponse.json(e);
  }
};
