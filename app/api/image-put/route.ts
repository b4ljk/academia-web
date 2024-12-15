// import { s3 } from "@/utils/aws";
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get('name');

  const fileKey = 'files/' + fileName;

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
    Key: fileKey || ''
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });

  return NextResponse.json({ url, message: 'success' });
}
