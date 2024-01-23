import { S3_BUCKET, S3_CUSTOM_ENDPOINT, S3_ENDPOINT } from './envValues';

export const COOKIE_NAME = 'session';
export const JWT_PROP_NAME = 'jwtUser';
export const S3_PREFIX =
  S3_CUSTOM_ENDPOINT === undefined ? `${S3_ENDPOINT}/${S3_BUCKET}/` : `${S3_CUSTOM_ENDPOINT}/`;
