import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '~/utils/s3';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const walletAddress = formData.get('walletAddress');
    const file = (formData.get('pfp') as File) ?? null;
    console.log(walletAddress);
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // await uploadToS3(buffer, 'pfp/profile.png');
      return NextResponse.json({ status: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No file' }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
