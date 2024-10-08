import { NextRequest, NextResponse } from 'next/server';
import { baseClient } from '~/lib/client';
import { getAnotherS3Object, uploadToAnotherS3 } from '~/utils/s3';

type ReferralData = {
  [key: string]: number;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { refCode, hash, address }: { refCode: string; hash: `0x${string}`; address: string } = await req.json();

    if (!hash) {
      return NextResponse.json({ success: false, message: 'Transaction hash is required' }, { status: 400 });
    }

    const receipt = await baseClient.getTransactionReceipt({ hash });
    if (!receipt) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    const toAddress = receipt.from.toLowerCase().trim();
    const address2 = address.toLowerCase().trim();

    if (toAddress !== address2) {
      console.error('Addresses do not match:', toAddress, address2);
      return NextResponse.json({ success: false, message: 'Address mismatch' }, { status: 400 });
    }

    const targetTopics = '0x19f5f791ee407773427bf7b970bbbc3375065c32edd1ab142e23a84f94b0719b';
    const count = receipt.logs.filter((log: any) => log.topics.includes(targetTopics)).length;

    if (!refCode) {
      return NextResponse.json({ success: false, message: 'Referral code not found' }, { status: 400 });
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME2 || '';
    if (!bucketName) {
      throw new Error('S3 bucket name is not defined');
    }

    const fileKey = 'referrals.json';

    const fileContent = await getAnotherS3Object(fileKey);
    let data: ReferralData = fileContent ? JSON.parse(fileContent as string) : {};

    if (data[refCode]) {
      data[refCode] += count;
    } else {
      data[refCode] = count;
    }

    const jsonData = JSON.stringify(data, null, 2);

    await uploadToAnotherS3(jsonData, fileKey, 'application/json');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing transaction:', error);
    return NextResponse.json({ error: 'Transaction processing failed', message: error.message }, { status: 500 });
  }
};
