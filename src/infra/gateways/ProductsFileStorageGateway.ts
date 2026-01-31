import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import KSUID from 'ksuid';

import { s3Client } from '@infra/clients/s3Cient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { minutesToSeconds } from '@shared/utils/minutesToSeconds';

@Injectable()
export class ProductsFileStorageGateway {
  constructor(private readonly config: AppConfig) {}

  static generateProductFileKey(inputType: string): string {
    const extension = inputType;
    const filename = `${KSUID.randomSync().string}.${extension}`;

    return filename;
  }

  getFileUrl(fileKey: string) {
    const cdn = this.config.cdns.productsCDN;

    return `https://${cdn}/${fileKey}`;
  }

  async createPOST({
    productId,
    file,
  }: ProductsFileStorageGateway.CreatePOSTParams): Promise<ProductsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.productsBucket;
    const contentType = file.inputType;

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutesToSeconds(5),
      Conditions: [
        { bucket },
        ['eq', '$key', file.key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: {
        'x-amz-meta-productId': productId,
      },
    });

    const uploadSignature = Buffer.from(JSON.stringify({ url, fields: {
      ...fields,
      'Content-Type': contentType,
    } })).toString('base64');

    return {
      uploadSignature,
    };
  }
}

export namespace ProductsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: string;
  };

  export type CreatePOSTParams = {
    productId: string;
    file: {
      key: string;
      size: number;
      inputType: string;
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string,
  };
}
