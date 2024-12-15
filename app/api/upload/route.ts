import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Client,
  ListBucketsCommand,
  S3ClientConfig,
  PutObjectCommand
} from '@aws-sdk/client-s3';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(
        "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
        {
          status: 401
        }
      );
    }

    const file = req.body || '';
    const contentType = req.headers.get('content-type') || 'text/plain';
    const filename = req.headers.get('x-filename') || 'file';

    const bucket = process.env.S3_BUCKET_PUBLIC || '';
    const buffer = await new Response(file).arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const s3Configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET || ''
      },
      region: process.env.AWS_REGION
    };
    const s3 = new S3Client(s3Configuration);

    const finalNameUnique = uuidv4();
    // safe to use the filename as it is, as it is already sanitized
    const url_encoded = encodeURIComponent(filename);
    const finalName = `${finalNameUnique}${url_encoded}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PUBLIC || '',
      Key: finalName,
      Body: fileBuffer,
      ContentType: contentType
    });

    const response = await s3.send(command);

    return NextResponse.json({
      url: `https://d2fdkqqxx3jf3.cloudfront.net/${finalName}`
    });
  } catch (e) {
    console.log(e);
    return new Response('Internal Server Error', {
      status: 500
    });
  }
}
