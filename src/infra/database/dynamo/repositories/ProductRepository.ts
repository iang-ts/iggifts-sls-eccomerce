import { Product } from '@application/entities/Product';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProductItem } from '../items/ProductItem';

@Injectable()
export class ProductRepository {
  constructor(private readonly config: AppConfig) {}

  async create(product: Product): Promise<void> {
    const productItem = ProductItem.fromEntity(product);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: productItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
