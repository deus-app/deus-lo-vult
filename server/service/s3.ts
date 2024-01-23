import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { MultipartFile } from '@fastify/multipart';
import { S3_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT, S3_REGION, S3_SECRET_KEY } from './envValues';

const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  forcePathStyle: true,
  credentials: { accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY },
});

export const s3 = {
  put: async (key: string, data: MultipartFile): Promise<void> => {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      ContentType: data.mimetype,
      ACL: 'public-read',
      Key: key,
      Body: await data.toBuffer(),
    });

    await s3Client.send(command);
  },
};
