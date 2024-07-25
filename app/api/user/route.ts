import { NextRequest, NextResponse } from 'next/server';
import { recoverMessageAddress } from 'viem';
import prisma from '~/lib/prisma';
import { uploadToS3 } from '~/utils/s3';

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { walletAddress, messageData, originalMessage } = data;

    if (!walletAddress) {
      return NextResponse.json({ error: 'No address' }, { status: 400 });
    }
    if (!messageData) {
      return NextResponse.json({ error: 'No message data' }, { status: 400 });
    }
    if (!originalMessage) {
      return NextResponse.json(
        { error: 'No original message data' },
        { status: 400 }
      );
    }

    const recoveredAddress = await recoverMessageAddress({
      message: originalMessage,
      signature: messageData,
    });

    if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
      try {
        const user = await prisma.user.create({
          data: { walletAddress },
        });
        return NextResponse.json({ user }, { status: 200 });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const walletAddress = (formData.get('walletAddress') as string) ?? null;
    const file = (formData.get('pfp') as File) ?? null;
    const name = (formData.get('name') as string) ?? null;
    const twitter = (formData.get('twitter') as string) ?? null;
    const messageData = (formData.get('messageData') as `0x${string}`) ?? null;
    const originalMessage = (formData.get('originalMessage') as string) ?? null;

    if (!walletAddress) {
      return NextResponse.json({ error: 'No address' }, { status: 400 });
    }
    if (!messageData) {
      return NextResponse.json({ error: 'No message data' }, { status: 400 });
    }
    if (!originalMessage) {
      return NextResponse.json(
        { error: 'No original message data' },
        { status: 400 }
      );
    }

    const recoveredAddress = await recoverMessageAddress({
      message: originalMessage,
      signature: messageData,
    });

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    let pfp: string | undefined = undefined;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      const filename = `${Date.now()}.${ext}`;
      await uploadToS3(buffer, `pfp/${filename}`, file.type);
      pfp = `https://traitforge.s3.ap-southeast-2.amazonaws.com/pfp/${filename}`;
    }

    const user = await prisma.user.update({
      where: { walletAddress },
      data: { name, twitter, pfp },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const walletAddress = searchParams.get('walletAddress');
  try {
    const user = await prisma.user.findFirst({
      where: { walletAddress: walletAddress as string },
    });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
