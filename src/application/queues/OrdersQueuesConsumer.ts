
import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { Order } from '@application/entities/Order';
import { PaymentStatus } from '@application/entities/PaymentStatus';
import { OrderRepository } from '@infra/database/dynamo/repositories/OrderRepository';
import { OrdersQueueGateway } from '@infra/gateways/OrdersQueueGateway';
import { PaymentGateway } from '@infra/gateways/PaymentGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class OrdersQueuesConsumer implements IQueueConsumer<OrdersQueueGateway.Message> {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly orderRepository: OrderRepository,
  ) {}

  async process(params: OrdersQueueGateway.Message): Promise<void> {

    await this.orderRepository.updateStatus({
      orderId: params.order.id,
      status: Order.Status.PROCESSING,
    });

    const { paymentStatus } = await this.paymentGateway.pay({
      cardDetails: params.cardDetails,
      totalAmount: params.order.totalAmount,
      billingAddress: params.order.shippingAddress,
    });

    if (paymentStatus === PaymentStatus.SUCCESS) {
      await this.orderRepository.updateStatus({
        orderId: params.order.id,
        status: Order.Status.PAID,
      });
    }

    if (paymentStatus === PaymentStatus.DECLINED) {
      await this.orderRepository.updateStatus({
        orderId: params.order.id,
        status: Order.Status.DECLINED,
      });
    }

    if (paymentStatus === PaymentStatus.SUSPECT_FRAUD) {
      await this.orderRepository.updateStatus({
        orderId: params.order.id,
        status: Order.Status.CANCELLED,
      });
    }

  }
}
