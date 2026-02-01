import { Order } from '@application/entities/Order';
import { NotFound } from '@application/errors/http/NotFound';
import { OrderRepository } from '@infra/database/dynamo/repositories/OrderRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetOrderStatusUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) { }

  async execute(orderId: string): Promise<GetOrderStatusUseCase.Output> {
    const order = await this.orderRepository.getStatus(orderId);

    if (!order) {
      throw new NotFound();
    }

    return {
      status: order.status,
    };
  }
}

export namespace GetOrderStatusUseCase {
  export type Output = {
    status: Order.Status;
  };
}
