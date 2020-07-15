import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';

const client = new AWS.S3();

const S3_BUCKET = process.env.S3_BUCKET || 'notely-dev';
const DEFAULT_EXPIRE_TIME = 2 * 60;

const getSignedUrlPromise = (operation: string, params: any) =>
  new Promise<string>((resolve, reject) => {
    client.getSignedUrl(operation, params, (error, url) => {
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });

export const getObjectUrl = (objectKey: string) => {
  return `https://${S3_BUCKET}.s3.amazonaws.com/${objectKey}`;
};

@Injectable()
export class StorageService {
  constructor() {}

  async getSignedUrl(key: string, contentType: string) {
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: DEFAULT_EXPIRE_TIME,
      ACL: 'public-read',
      ContentType: contentType,
    };

    return await getSignedUrlPromise('putObject', params);
  }
}
