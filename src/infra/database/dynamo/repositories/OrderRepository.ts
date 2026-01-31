import { Order } from '@application/entities/Order';
import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
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

  async updateStatus({ orderId, status }: OrderRepository.UpdateStatusParams): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: OrderItem.getPK(orderId),
        SK: OrderItem.getSK(orderId),
      },
      UpdateExpression: `
        SET #status = :newStatus
      `,
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':newStatus': status,
      },
      ConditionExpression: 'attribute_exists(PK)',
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

  async updatePartial({ orderId, data }: OrderRepository.UpdatePartialParams): Promise<void> {
    if (Object.keys(data).length === 0) {
      return;
    }

    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const { updateExpression, expressionAttributeNames, expressionAttributeValues } =
      this.buildUpdateExpression(dataWithTimestamp);

    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: OrderItem.getPK(orderId),
        SK: OrderItem.getSK(orderId),
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(PK)',
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

  private buildUpdateExpression(data: Record<string, any>) {
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    const setExpressions: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      const attributeName = `#${key}`;
      const attributeValue = `:${key}`;

      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = value;
      setExpressions.push(`${attributeName} = ${attributeValue}`);
    });

    const updateExpression = `SET ${setExpressions.join(', ')}`;

    return {
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    };
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

export namespace OrderRepository {
  export type UpdateStatusParams = {
    orderId: string;
    status: Order.Status;
  };

  export type UpdatePartialParams = {
    orderId: string;
    data: Partial<{
      status: Order.Status;
      totalAmount: number;
      shippingAddress: Order.ShippingAddress;
      gatewayPaymentIntentId: string;
    }>;
  };
}
