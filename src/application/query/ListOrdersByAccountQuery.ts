import { Order } from '@application/entities/Order';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { OrderItem } from '@infra/database/dynamo/items/OrderItem';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';

@Injectable()
export class ListOrdersByAccountQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute(accountId: string): Promise<Order[]> {
    const command = new QueryCommand({
      TableName: this.appConfig.db.dynamodb.mainTable,
      IndexName: 'GS1',
      ProjectionExpression: '#GSI1PK, #GSI1SK, #id, #accountId, #status, #totalAmount, #shippingAddress, #gatewayPaymentIntentId, #updatedAt, #createdAt',
      KeyConditionExpression: '#GSI1PK = :GSI1PK AND begins_with(#GSI1SK, :GSI1SK)',
      ScanIndexForward: false,
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#GSI1SK': 'GSI1SK',
        '#id': 'id',
        '#accountId': 'accountId',
        '#status': 'status',
        '#totalAmount': 'totalAmount',
        '#shippingAddress': 'shippingAddress',
        '#gatewayPaymentIntentId': 'gatewayPaymentIntentId',
        '#updatedAt': 'updatedAt',
        '#createdAt': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': OrderItem.getGSI1PK(accountId),
        ':GSI1SK': 'ORDER#',
      },
    });

    const { Items: ordersItem = [] } = await dynamoClient.send(command);

    return ordersItem.map(order => OrderItem.toEntity(order as OrderItem.ItemType));
  }
}
