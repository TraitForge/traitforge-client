import { composeIMG } from '@/utils/imageProcessing';
import s3 from '@/aws-config';

async function processImage(paddedEntropy, entityGeneration) {
    const imageBuffer = await composeIMG(paddedEntropy,  entityGeneration);
    if (imageBuffer) {
        const uri = await generateUri(paddedEntropy,  entityGeneration);
        const fileName = `${uri}`;
        await uploadToS3(imageBuffer, fileName);

        return `https://traitforge.s3.amazonaws.com/${fileName}`;
    } else {
        throw new Error('Image Layering Failed');
    }
}

async function startProcessing() {
    let  entityGeneration = 1;
    while ( entityGeneration <= 2) {
        for (let entityEntropy = 0; entityEntropy <= 999999; entityEntropy++) {
            const paddedEntropy = entityEntropy.toString().padStart(6, '0');
            try {
                const url = await processImage(paddedEntropy,  entityGeneration);
                console.log(`Processed ${paddedEntropy} in generation ${ entityGeneration}: ${url}`);
            } catch (error) {
                console.error(`Failed at ${paddedEntropy} in generation ${ entityGeneration}:`, error);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        entityGeneration++;
    }
}

async function uploadToS3(imageBuffer, fileName) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
    };
    return s3.upload(params).promise();
}

async function generateUri(paddedEntropy,  entityGeneration) {
    return `${paddedEntropy}_${entityGeneration}.jpeg`;
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { paddedEntropy,  entityGeneration } = req.query;

        try {
            const url = await processImage(paddedEntropy,  entityGeneration);
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

startProcessing();
