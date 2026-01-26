import { OrderProduct } from '@application/entities/OrderProduct';
import { DeleteCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { OrderProductItem } from '../items/OrderProductItem';

@Injectable()
export class OrderProductRepository {
  constructor(private readonly config: AppConfig) {}

  async findByOrderId(orderId: string): Promise<OrderProduct[]> {
    const command = new QueryCommand({
      TableName: this.config.db.dynamodb.mainTable,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': OrderProductItem.getPK(orderId),
      },
    });

    const { Items: OrderItems } = await dynamoClient.send(command);
    const items = OrderItems ?? [];

    return items
      .filter(item => item.SK.startsWith('ORDERPRODUCT#'))
      .map(item => OrderProductItem.toEntity(item as OrderProductItem.ItemType));
  }

  async create(orderProduct: OrderProduct): Promise<void> {
    const orderProductItem = OrderProductItem.fromEntity(orderProduct);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: orderProductItem.toItem(),
    });

    await dynamoClient.send(command);
  }

  async delete(orderId: string, orderProductId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: OrderProductItem.getPK(orderId),
        SK: OrderProductItem.getSK(orderProductId),
      },
    });

    await dynamoClient.send(command);
  }
}
