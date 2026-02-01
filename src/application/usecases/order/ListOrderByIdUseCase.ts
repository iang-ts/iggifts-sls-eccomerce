import { Order } from '@application/entities/Order';
import { NotFound } from '@application/errors/http/NotFound';
import { OrderProductRepository } from '@infra/database/dynamo/repositories/OrderProductRepository';
import { OrderRepository } from '@infra/database/dynamo/repositories/OrderRepository';
import { ProductRepository } from '@infra/database/dynamo/repositories/ProductRepository';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListOrderByIdUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderProductRepository: OrderProductRepository,
    private readonly productFileStorageGateway: ProductsFileStorageGateway,
    private readonly productRepository: ProductRepository,
  ) { }

  async execute(orderId: string): Promise<ListOrderByIdUseCase.Output> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFound();
    }

    const orderProducts = await this.orderProductRepository.findByOrderId(orderId);

    const products = await this.productRepository.findByIds(orderProducts.map(op => op.productId));

    const imagesMap = new Map();

    products.forEach(product => {
      imagesMap.set(product.id, this.productFileStorageGateway.getFileUrl(product.inputFileKey));
    });

    const orderWithProducts = {
      id: order.id,
      accountId: order.accountId,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      orderProducts: orderProducts.map(op => ({
        id: op.id,
        productId: op.productId,
        productName: op.productName,
        imageUrl: imagesMap.get(op.productId),
        quantity: op.quantity,
        unitPrice: op.unitPrice,
        subtotal: op.subtotal,
      })),
      gatewayPaymentIntentId: order.gatewayPaymentIntentId,
      updatedAt: order.updatedAt,
      createdAt: order.createdAt,
    };

    return {
      ...orderWithProducts,
      updatedAt: new Date(orderWithProducts.updatedAt).toISOString(),
      createdAt: new Date(orderWithProducts.createdAt).toISOString(),
    };
  }
}

export namespace ListOrderByIdUseCase {
  export type Output = {
    id: string;
    accountId: string;
    status: Order.Status;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    orderProducts: OrderProductItem[];
    gatewayPaymentIntentId?: string;
    updatedAt: string;
    createdAt: string;
  };

  export type OrderProductItem = {
    id: string;
    productId: string;
    productName: string;
    imageUrl: string
    quantity: number;
    unitPrice: number;
    subtotal: number;
  };

  export type ShippingAddress = {
    name: string;
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
  };
}
