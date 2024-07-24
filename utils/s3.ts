import { S3 } from 'aws-sdk';
import s3 from '~/aws-config';

export const uploadToS3 = async (imageBuffer: Buffer, fileName: string) => {
  const params: S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: fileName,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  };
  return s3.upload(params).promise();
};

// // Local save for faster processing
// async function uploadToS3(imageBuffer: Buffer, fileName: string) {
//   fs.writeFileSync(path.join('assets', fileName), imageBuffer, { flag: 'w' });
// }

export const getS3Object = async (fileName: string, folder = 'variables') => {
  try {
    const params: S3.GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: `${folder}/${fileName}`,
    };

    const data = await s3.getObject(params).promise();

    return data.Body;
  } catch (e: any) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
};

// // Local method for faster processing
// const getS3Object = async (fileName: string) => {
//   const imagePath = path.join(varConfig.variablesPath, fileName);
//   return await sharp(imagePath).toBuffer();
// };
