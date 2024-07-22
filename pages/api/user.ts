import { NextApiRequest, NextApiResponse } from 'next';
import { recoverMessageAddress } from 'viem';
import prisma from '~/lib/prisma';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { walletAddress, messageData, originalMessage } = await JSON.parse(
    req.body
  );

  const recoveredAddress = await recoverMessageAddress({
    message: originalMessage,
    signature: messageData,
  });

  if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
    try {
      const user = await prisma.user.create({
        data: { walletAddress },
      });
      res.status(200).send({ user });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  } else {
    res.status(500).send({ error: 'Invalid signature' });
  }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { walletAddress, name, twitter, pfp } = req.body;
  try {
    const user = await prisma.user.update({
      where: { walletAddress },
      data: {
        walletAddress,
        name,
        twitter,
        pfp,
      },
    });
    res.status(200).send({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { walletAddress } = req.query;
  try {
    const user = await prisma.user.findFirst({
      where: { walletAddress: walletAddress as string },
    });
    if (user) {
      res.status(200).send({ user });
    } else {
      res.status(404).send({ error: 'User does not exist' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await createUser(req, res);
  } else if (req.method === 'PUT') {
    await updateUser(req, res);
  } else if (req.method === 'GET') {
    await getUser(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
