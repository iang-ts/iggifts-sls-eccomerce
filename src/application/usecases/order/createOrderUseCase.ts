import { Order } from '@application/entities/Order';
import { OrderProduct } from '@application/entities/OrderProduct';
import { ErrorCode } from '@application/errors/ErrorCode';
import { NotFound } from '@application/errors/http/NotFound';
import { OrderProductRepository } from '@infra/database/dynamo/repositories/OrderProductRepository';
import { OrderRepository } from '@infra/database/dynamo/repositories/OrderRepository';
import { ProductRepository } from '@infra/database/dynamo/repositories/ProductRepository';
import { OrdersQueueGateway } from '@infra/gateways/OrdersQueueGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { Saga } from '@shared/saga/saga';

@Injectable()
export class createOrderUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderProductRepository: OrderProductRepository,
    private readonly ordersQueueGateway: OrdersQueueGateway,
    private readonly saga: Saga,
  ) { }

  async execute({
    accountId,
    products,
    address,
    cardNumber,
    cardMonth,
    cardYear,
    cardCvv,
  }: createOrderUseCase.Input): Promise<createOrderUseCase.Output> {
    return this.saga.run(async () => {
      const uniqueProductIds = [...new Set(products)];

      const findProducts = await this.productRepository.findByIds(uniqueProductIds);

      if (findProducts.length !== uniqueProductIds.length) {
        const foundIds = new Set(findProducts.map(p => p.id));
        const notFoundIds = uniqueProductIds.filter(id => !foundIds.has(id));

        throw new NotFound(
          `Products not found: ${notFoundIds.join(', ')}`,
          ErrorCode.PRODUCT_NOT_FOUND,
        );
      }

      const productMap = new Map(findProducts.map(p => [p.id, p]));

      const productQuantities = products.reduce((acc, productId) => {
        acc.set(productId, (acc.get(productId) ?? 0) + 1);
        return acc;
      }, new Map<string, number>());

      const orderProducts: OrderProduct[] = [];
      let totalAmount = 0;

      productQuantities.forEach((quantity, productId) => {
        const product = productMap.get(productId)!;

        const subtotal = product.price * quantity;
        totalAmount += subtotal;

        const orderProduct = new OrderProduct({
          orderId: '',
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.price,
          subtotal,
        });

        orderProducts.push(orderProduct);
      });

      const order = new Order({
        accountId,
        shippingAddress: address,
        status: Order.Status.PENDING,
        totalAmount,
      });

      orderProducts.forEach(op => {
        (op as any).orderId = order.id;
      });

      await this.orderRepository.create(order);
      this.saga.addCompensation(async () => {
        await this.orderRepository.delete(order.id);
      });

      for (const orderProduct of orderProducts) {
        await this.orderProductRepository.create(orderProduct);
        this.saga.addCompensation(async () => {
          await this.orderProductRepository.delete(order.id, orderProduct.id);
        });
      }

      await this.orderRepository.updateStatus({
        orderId: order.id,
        status: Order.Status.QUEUED,
      });

      order.status = Order.Status.QUEUED;

      await this.ordersQueueGateway.publish({
        order,
        cardDetails: {
          cardNumber,
          cardMonth,
          cardYear,
          cardCvv,
        },
      });

      return {
        order: order,
        orderProducts,
      };
    });
  }
}

export namespace createOrderUseCase {
  export type Input = {
    accountId: string;
    products: string[];
    address: {
      name: string;
      street: string;
      number: string;
      state: string;
      postalCode: string;
    };
    cardNumber: string;
    cardMonth: string;
    cardYear: string;
    cardCvv: string;
  };

  export type Output = {
    order: Order;
    orderProducts: OrderProduct[];
  };
}
