import { NextRequest, NextResponse } from 'next/server';
import { getAnotherS3Object, uploadToAnotherS3 } from '~/utils/s3';

type ReferralData = {
  [key: string]: number;
};

export async function POST(req: NextRequest) {
  const { refCode } = await req.json();
  if (typeof refCode !== 'string') {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME2 || '';
  if (!bucketName) {
    throw new Error('S3 bucket name is not defined');
  }
  try {
  const fileKey = 'referrals.json';

  const fileContent = await getAnotherS3Object(fileKey);
  let data: ReferralData = fileContent ? JSON.parse(fileContent as string) : {};

    if (data[refCode]) {
      data[refCode] += 1;
    } else {
      data[refCode] = 1;
    }
    const jsonData = JSON.stringify(data, null, 2);
    await uploadToAnotherS3(jsonData, fileKey, 'application/json');
    console.log("submitted increment successfully")
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json({ error: 'Failed to store referral data' }, { status: 500 });
  }
}
