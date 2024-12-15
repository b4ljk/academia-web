import { S3ClientConfig } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET || ''
    },
    region: process.env.AWS_REGION
  };
  const s3 = new S3Client(s3Configuration);

  const bucket = process.env.S3_BUCKET_PUBLIC || '';

  const params = {
    Bucket: bucket,
    Prefix: 'files/'
  };

  const command = new ListObjectsV2Command(params);
  const response = await s3.send(command);

  return NextResponse.json(response);
}
