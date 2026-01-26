import { Order } from '@application/entities/Order';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from '@infra/clients/sqsClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';

@Injectable()
export class OrdersQueueGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async publish(message: OrdersQueueGateway.Message) {
    const command = new SendMessageCommand({
      QueueUrl: this.appConfig.queues.ordersQueueUrl,
      MessageBody: JSON.stringify(message),
    });

    await sqsClient.send(command);
  }
}

export namespace OrdersQueueGateway {
  export type Message = Order.Attributes;
}
