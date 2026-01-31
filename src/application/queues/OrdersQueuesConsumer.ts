
import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { Order } from '@application/entities/Order';
import { PaymentStatus } from '@application/entities/PaymentStatus';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { OrderProductRepository } from '@infra/database/dynamo/repositories/OrderProductRepository';
import { OrderRepository } from '@infra/database/dynamo/repositories/OrderRepository';
import { ProductRepository } from '@infra/database/dynamo/repositories/ProductRepository';
import PaymentConfirmation from '@infra/emails/templates/confirmPayment/PaymentConfirmation';
import { EmailGateway } from '@infra/gateways/EmailGateway';
import { OrdersQueueGateway } from '@infra/gateways/OrdersQueueGateway';
import { PaymentGateway } from '@infra/gateways/PaymentGateway';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { render } from '@react-email/render';
import { AppConfig } from '@shared/config/AppConfig';
import React from 'react';

@Injectable()
export class OrdersQueuesConsumer implements IQueueConsumer<OrdersQueueGateway.Message> {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly paymentGateway: PaymentGateway,
    private readonly accountRepository: AccountRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderProductRepository: OrderProductRepository,
    private readonly productRepository: ProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
    private readonly emailGateway: EmailGateway,
  ) {}

  async process(params: OrdersQueueGateway.Message): Promise<void> {

    await this.orderRepository.updateStatus({
      orderId: params.order.id,
      status: Order.Status.PROCESSING,
    });

    const { paymentStatus, transID } = await this.paymentGateway.pay({
      cardDetails: params.cardDetails,
      totalAmount: params.order.totalAmount,
      billingAddress: params.order.shippingAddress,
    });

    if (paymentStatus === PaymentStatus.SUCCESS) {
      await this.orderRepository.updateStatus({
        orderId: params.order.id,
        status: Order.Status.PAID,
      });

      const account = await this.accountRepository.findById(params.order.accountId);

      if (account) {
        const orderProducts = await this.orderProductRepository.findByOrderId(params.order.id);

        const productIds = orderProducts.map(op => op.productId);
        const products = await this.productRepository.findByIds(productIds);
        const productMap = new Map(products.map(p => [p.id, p]));

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
          React.createElement(PaymentConfirmation, {
            customerName: account.name,
            orderId: params.order.id,
            paymentDate: new Date().toISOString(),
            paymentMethod: 'Credit Card',
            items,
            subtotal: params.order.totalAmount,
            shipping: 0,
            total: params.order.totalAmount,
            shippingAddress: {
              street: params.order.shippingAddress.street,
              number: params.order.shippingAddress.number,
              city: params.order.shippingAddress.city,
              state: params.order.shippingAddress.state,
              postalCode: params.order.shippingAddress.postalCode,
            },
            orderDetailsUrl: `https://ig-gifts.ian.dev.br/pedidos/${params.order.id}`,
          }),
        );

        await this.emailGateway.sendEmail({
          from: this.appConfig.email.emailFrom,
          to: [account.email],
          subject: `Payment Confirmed - Order ${params.order.id}`,
          html,
        });
      }
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

    await this.orderRepository.updatePartial({
      orderId: params.order.id,
      data: {
        gatewayPaymentIntentId: transID,
      },
    });

  }
}
