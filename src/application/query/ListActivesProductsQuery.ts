import { Product } from '@application/entities/Product';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { ProductItem } from '@infra/database/dynamo/items/ProductItem';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';

@Injectable()
export class ListActivesProductsQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute(): Promise<Product[]> {
    const command = new QueryCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,
      IndexName: 'GSI1',
      ProjectionExpression: '#GSI1PK, #id, #name, #description, #price, #category, #inputFileKey, #stockQuantity, #createdAt',
      KeyConditionExpression: '#GSI1PK = :GSI1PK',
      ScanIndexForward: false,
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
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
        ':GSI1PK': ProductItem.getGSI1PK(),
      },
    });

    const { Items: productsItem = [] } = await dynamoClient.send(command);

    return productsItem.map(product => ProductItem.toEntity(product as ProductItem.ItemType));
  }
}
