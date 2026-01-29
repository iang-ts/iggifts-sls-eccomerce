import { Product } from '@application/entities/Product';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { ProductItem } from '@infra/database/dynamo/items/ProductItem';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';

@Injectable()
export class ListProductsByCategoryQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute(category: string): Promise<Product[]> {
    const command = new QueryCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,
      IndexName: 'GSI2',
      ProjectionExpression: '#GSI2PK, #id, #name, #description, #price, #category, #inputFileKey, #stockQuantity, #createdAt',
      KeyConditionExpression: '#GSI2PK = :GSI2PK',
      ScanIndexForward: false,
      ExpressionAttributeNames: {
        '#GSI2PK': 'GSI2PK',
        '#id': 'id',
        '#name': 'name',
        '#description': 'description',
        '#price': 'price',
        '#category': 'category',
        '#inputFileKey': 'inputFileKey',
        '#stockQuantity': 'stockQuantity',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':GSI2PK': ProductItem.getGSI2PK(category),
      },
    });

    const { Items: productsItem = [] } = await dynamoClient.send(command);

    return productsItem.map(product => ProductItem.toEntity(product as ProductItem.ItemType));
  }
}
