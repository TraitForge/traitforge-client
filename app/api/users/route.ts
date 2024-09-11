import { NextRequest, NextResponse } from 'next/server';

import prisma from '~/lib/prisma';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name') || '';

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          startsWith: name as string,
          mode: 'insensitive',
        },
      },
    });

    const walletAddress = await prisma.user.findMany({
      where: {
        walletAddress: {
          startsWith: name as string,
          mode: 'insensitive',
        },
      },
      include: {
        entities: true,
        _count: {
          select: { entities: true }
        },
      },
    });

    const twitter = await prisma.user.findMany({
      where: {
        twitter: {
          startsWith: name as string,
          mode: 'insensitive',
        },
      },
    });

    if (users || walletAddress || twitter) {
      return NextResponse.json(
        { users, walletAddress, twitter },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  if (req.method === 'POST') {
    try {
      const {
        walletAddress,
        entity,
      }: { walletAddress: string; entity: number } = await req.json();

      const existingUser = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!existingUser) {
        return NextResponse.json({ error: 'No address' }, { status: 404 });
      }

      await prisma.entity.createMany({
        data: [
          {
            entropy: entity,
            userId: existingUser.id,
          },
        ],
      });

      return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
};
