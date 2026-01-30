import { Order } from '@application/entities/Order';
import { OrderProduct } from '@application/entities/OrderProduct';
import { ErrorCode } from '@application/errors/ErrorCode';
import { NotFound } from '@application/errors/http/NotFound';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { OrderProductRepository } from '@infra/database/dynamo/repositories/OrderProductRepository';
import { OrderRepository } from '@infra/database/dynamo/repositories/OrderRepository';
import { ProductRepository } from '@infra/database/dynamo/repositories/ProductRepository';
import OrderConfirmation from '@infra/emails/templates/confirmOrder/OrderConfirmation';
import { EmailGateway } from '@infra/gateways/EmailGateway';
import { OrdersQueueGateway } from '@infra/gateways/OrdersQueueGateway';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { render } from '@react-email/render';
import { AppConfig } from '@shared/config/AppConfig';
import { Saga } from '@shared/saga/saga';
import React from 'react';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
    private readonly accountRepository: AccountRepository,
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderProductRepository: OrderProductRepository,
    private readonly ordersQueueGateway: OrdersQueueGateway,
    private readonly emailGateway: EmailGateway,
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

      const account = await this.accountRepository.findById(accountId);

      if (!account) {
        throw new NotFound(
          `Account not found: ${accountId}`,
          ErrorCode.ACCOUNT_NOT_FOUND,
        );
      }

      const items = orderProducts.map(op => {
        const product = productMap.get(op.productId)!;
        const imageUrl = this.productsFileStorageGateway.getFileUrl(product.inputFileKey);

        return {
          imageUrl,
          name: op.productName,
          quantity: op.quantity,
          price: op.unitPrice,
          total: op.subtotal,
        };
      });

      const html = await render(
        React.createElement(OrderConfirmation, {
          customerName: account.name,
          orderId: order.id,
          orderDate: order.createdAt.toISOString(),
          items,
          subtotal: totalAmount,
          shipping: 0,
          total: totalAmount,
          shippingAddress: {
            street: order.shippingAddress.street,
            number: order.shippingAddress.number,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postalCode: order.shippingAddress.postalCode,
          },
          orderDetailsUrl: `https://ig-gifts.ian.dev.br/pedidos/${order.id}`,
        }),
      );

      await this.emailGateway.sendEmail({
        from: this.appConfig.email.emailFrom,
        html,
        subject: `Order Confirmation ${order.id}`,
        to: [account.email],
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
      city: string;
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
