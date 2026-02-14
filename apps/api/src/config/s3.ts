import { S3Client } from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// S3 Client Singleton
// ---------------------------------------------------------------------------

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY_ID || "";
const S3_SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const S3_REGION = process.env.S3_REGION || "us-east-1";

export const S3_BUCKET = process.env.S3_BUCKET || "menontrucks";

export const s3Client = new S3Client({
  ...(S3_ENDPOINT ? { endpoint: S3_ENDPOINT } : {}),
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: !!S3_ENDPOINT, // Required for MinIO / non-AWS S3 providers
});

export default s3Client;
