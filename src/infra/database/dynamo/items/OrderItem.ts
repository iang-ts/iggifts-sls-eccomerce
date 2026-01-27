import { Order } from '@application/entities/Order';

export class OrderItem {
  private readonly type = 'Order';

  private readonly keys: OrderItem.Keys;

  constructor(private readonly attrs: OrderItem.Attributes) {
    this.keys = {
      PK: OrderItem.getPK(this.attrs.id),
      SK: OrderItem.getSK(this.attrs.id),
      GSI1PK: OrderItem.getGSI1PK(this.attrs.accountId),
      GSI1SK: OrderItem.getGSI1SK(this.attrs.id, this.attrs.createdAt),
      GSI2PK: OrderItem.getGSI2PK(this.attrs.status),
      GSI2SK: OrderItem.getGSI2SK(this.attrs.id, this.attrs.createdAt),
    };
  }

  toItem(): OrderItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static fromEntity(order: Order) {
    return new OrderItem({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  }

  static toEntity(orderItem: OrderItem.ItemType) {
    return new Order({
      id: orderItem.id,
      accountId: orderItem.accountId,
      status: orderItem.status,
      totalAmount: orderItem.totalAmount,
      shippingAddress: orderItem.shippingAddress,
      gatewayPaymentIntentId: orderItem.gatewayPaymentIntentId ||  '',
      updatedAt: new Date(orderItem.updatedAt),
      createdAt: new Date(orderItem.createdAt),
    });
  }

  static getPK(orderId: string): OrderItem.Keys['PK'] {
    return `ORDER#${orderId}`;
  }

  static getSK(orderId: string): OrderItem.Keys['SK'] {
    return `ORDER#${orderId}`;
  }

  static getGSI1PK(accountId: string): OrderItem.Keys['GSI1PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1SK(orderId: string, createdAt: string): OrderItem.Keys['GSI1SK'] {
    return `ORDER#${orderId}#${createdAt}`;
  }

  static getGSI2PK(status: Order.Status): OrderItem.Keys['GSI2PK'] {
    return `ORDER#${status}`;
  }

  static getGSI2SK(orderId: string, createdAt: string): OrderItem.Keys['GSI2SK'] {
    return `ORDER#${orderId}#${createdAt}`;
  }
}

export namespace OrderItem {
  export type Keys = {
    PK: `ORDER#${string}`;
    SK: `ORDER#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ORDER#${string}#${string}`;
    GSI2PK: `ORDER#${string}`;
    GSI2SK: `ORDER#${string}#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    status: Order.Status;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    gatewayPaymentIntentId?: string;
    updatedAt: string;
    createdAt: string;
  };

  export type ShippingAddress = {
    name: string;
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Order';
  };
}
