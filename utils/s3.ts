import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  imageBuffer: Buffer,
  fileName: string,
  type = 'image/jpeg'
): Promise<void> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: fileName,
      Body: imageBuffer,
      ContentType: type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
  } catch (error: any) {
    console.error(`Error uploading file to S3: ${error.message}`);
    throw new Error(`Could not upload file to S3: ${error.message}`);
  }
};

export const getS3Object = async (fileName: string): Promise<Buffer | null> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: `variables/${fileName}`,
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.Body instanceof Readable) {
      const chunks: Uint8Array[] = [];
      for await (const chunk of data.Body) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    return null;
  } catch (e: any) {
    console.error(`Error retrieving file from S3: ${e.message}`);
    return null;
  }
};

export const uploadToAnotherS3 = async (
  content: string,
  fileName: string,
  type = 'application/json'
): Promise<void> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME2 || '',
    Key: `files/${fileName}`,
    Body: content,
    ContentType: type, 
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
};

export const getAnotherS3Object = async (fileName: string): Promise<string | null> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME2 || '',
      Key: `files/${fileName}`,
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.Body instanceof Readable) {
      const chunks: Uint8Array[] = [];
      for await (let chunk of data.Body) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString('utf-8');
    }

    return null;
  } catch (e: any) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
};