import { NextRequest, NextResponse } from 'next/server';
import prisma from '~/lib/prisma';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name') || '';

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            walletAddress: {
              startsWith: name as string,
            },
          },
          {
            name: {
              startsWith: name as string,
            },
          },
          {
            twitter: {
              startsWith: name as string,
            },
          },
        ],
      },
    });
    if (users) {
      return NextResponse.json({ users }, { status: 200 });
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
