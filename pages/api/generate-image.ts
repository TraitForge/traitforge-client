import { composeIMG } from '~/utils/imageProcessing';
import s3 from '~/aws-config';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { EntropyGeneratorABI } from '~/lib/abis';
import { publicClient } from '~/lib/config';
import { NextApiRequest, NextApiResponse } from 'next';
import { S3 } from 'aws-sdk';

async function startProcessing() {
  let entityGeneration = 2;
  for (let slotIndex = 0; slotIndex < 770; slotIndex++) {
    for (let numberIndex = 0; numberIndex < 13; numberIndex++) {
      try {
        const result = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.EntropyGenerator,
          abi: EntropyGeneratorABI,
          functionName: 'getPublicEntropy',
          args: [BigInt(slotIndex), BigInt(numberIndex)],
        });
        const paddedEntropy = String(result);
        const url = await processImage(paddedEntropy, entityGeneration);
        console.log(
          `Processed ${paddedEntropy} in generation ${entityGeneration}: ${url}`
        );
      } catch (error) {
        console.error(
          `Failed at slot ${slotIndex}, number ${numberIndex} in generation ${entityGeneration}:`,
          error
        );
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  entityGeneration++;
}

export async function processImage(
  paddedEntropy: string | number,
  entityGeneration: string | number
) {
  const imageBuffer = await composeIMG(paddedEntropy, entityGeneration);
  if (imageBuffer) {
    const uri = await generateUri(paddedEntropy, entityGeneration);
    const fileName = `${uri}`;
    await uploadToS3(imageBuffer, fileName);

    return `https://traitforge.s3.amazonaws.com/${fileName}`;
  } else {
    throw new Error('Image Layering Failed');
  }
}

async function uploadToS3(imageBuffer: Buffer, fileName: string) {
  const params: S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: fileName,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  };
  return s3.upload(params).promise();
}

async function generateUri(
  paddedEntropy: string | number,
  entityGeneration: string | number
) {
  return `${paddedEntropy}_${entityGeneration}.jpeg`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { paddedEntropy, entityGeneration } = req.query;

    try {
      const url = await processImage(
        paddedEntropy as string,
        entityGeneration as string
      );
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(url);
    } catch (error) {
      console.error('Failed to generate or upload:', error);
      res.status(500).send('Failed to compose or upload image');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
