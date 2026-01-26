import { Product } from '@application/entities/Product';
import { BatchGetCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProductItem } from '../items/ProductItem';

@Injectable()
export class ProductRepository {
  constructor(private readonly config: AppConfig) {}

  async findById(productId: string): Promise<Product | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: ProductItem.getPK(productId),
        SK: ProductItem.getSK(productId),
      },
    });

    const { Item: productItem = {} } = await dynamoClient.send(command);

    if (!productItem) {
      return null;
    }

    return ProductItem.toEntity(productItem as ProductItem.ItemType);
  }

  async findByIds(productIds: string[]): Promise<Product[]> {
    if (productIds.length === 0) {
      return [];
    }

    const command = new BatchGetCommand({
      RequestItems: {
        [this.config.db.dynamodb.mainTable]: {
          Keys: productIds.map(productId => ({
            PK: ProductItem.getPK(productId),
            SK: ProductItem.getSK(productId),
          })),
        },
      },
    });

    const { Responses } = await dynamoClient.send(command);
    const items = Responses?.[this.config.db.dynamodb.mainTable] ?? [];

    return items.map(item => ProductItem.toEntity(item as ProductItem.ItemType));
  }

  async create(product: Product): Promise<void> {
    const productItem = ProductItem.fromEntity(product);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: productItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
