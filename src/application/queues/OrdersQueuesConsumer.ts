
import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { OrdersQueueGateway } from '@infra/gateways/OrdersQueueGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class OrdersQueuesConsumer implements IQueueConsumer<OrdersQueueGateway.Message> {
  async process(params: OrdersQueueGateway.Message): Promise<void> {
    console.log(JSON.stringify({
      params,
    }, null, 2));
  }
}
