import { Order } from '@application/entities/Order';
import { DeleteCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { OrderItem } from '../items/OrderItem';

@Injectable()
export class OrderRepository {
  constructor(private readonly config: AppConfig) {}

  async findById(orderId: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: OrderItem.getPK(orderId),
        SK: OrderItem.getSK(orderId),
      },
    });

    const { Item: orderItem } = await dynamoClient.send(command);

    if (!orderItem) {
      return null;
    }

    return OrderItem.toEntity(orderItem as OrderItem.ItemType);
  }

  async create(order: Order): Promise<void> {
    const orderItem = OrderItem.fromEntity(order);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: orderItem.toItem(),
    });

    await dynamoClient.send(command);
  }

  async delete(orderId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: OrderItem.getPK(orderId),
        SK: OrderItem.getSK(orderId),
      },
    });

    await dynamoClient.send(command);
  }
}
