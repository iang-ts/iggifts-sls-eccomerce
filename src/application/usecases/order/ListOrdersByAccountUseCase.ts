import { Order } from '@application/entities/Order';
import { ListOrdersByAccountQuery } from '@application/query/ListOrdersByAccountQuery';
import { OrderProductRepository } from '@infra/database/dynamo/repositories/OrderProductRepository';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListOrdersByAccountUseCase {
  constructor(
    private readonly listOrdersByAccountQuery: ListOrdersByAccountQuery,
    private readonly orderProductRepository: OrderProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute(accountId: string): Promise<ListOrdersByAccountUseCase.Output> {

    const orders = await this.listOrdersByAccountQuery.execute(accountId);

    const orderProductsArray = await Promise.all(
      orders.map(order => this.orderProductRepository.findByOrderId(order.id)),
    );

    const orderProductsMap = new Map<string, typeof orderProductsArray[number]>();
    orderProductsArray.forEach((products, index) => {
      orderProductsMap.set(orders[index].id, products);
    });

    const ordersWithProducts = orders.map(order => ({
      id: order.id,
      accountId: order.accountId,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      orderProducts: (orderProductsMap.get(order.id) ?? []).map(op => ({
        id: op.id,
        productId: op.productId,
        productName: op.productName,
        quantity: op.quantity,
        unitPrice: op.unitPrice,
        subtotal: op.subtotal,
      })),
      gatewayPaymentIntentId: order.gatewayPaymentIntentId,
      updatedAt: order.updatedAt.toISOString(),
      createdAt: order.createdAt.toISOString(),
    }));

    return ordersWithProducts;
  }
}

export namespace ListOrdersByAccountUseCase {
  export type Output = {
    id: string;
    accountId: string;
    status: Order.Status;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    gatewayPaymentIntentId?: string;
    updatedAt: string;
    createdAt: string;
    orderProducts: OrderProductItem[];
  }[];

  export type OrderProductItem = {
    id: string;
    productId: string;
    productName: string;
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
