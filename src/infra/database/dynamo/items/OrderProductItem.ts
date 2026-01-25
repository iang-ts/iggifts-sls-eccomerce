import { OrderProduct } from '@application/entities/OrderProduct';

export class OrderProductItem {
  private readonly type = 'OrderProduct';

  private readonly keys: OrderProductItem.Keys;

  constructor(private readonly attrs: OrderProductItem.Attributes) {
    this.keys = {
      PK: OrderProductItem.getPK(this.attrs.orderId),
      SK: OrderProductItem.getSK(this.attrs.id),
      GSI1PK: OrderProductItem.getGSI1PK(this.attrs.productId),
      GSI1SK: OrderProductItem.getGSI1SK(this.attrs.id),
    };
  }

  toItem(): OrderProductItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static fromEntity(orderProduct: OrderProduct) {
    return new OrderProductItem({
      ...orderProduct,
    });
  }

  static toEntity(orderProductItem: OrderProductItem.ItemType) {
    return new OrderProduct({
      id: orderProductItem.id,
      orderId: orderProductItem.orderId,
      productId: orderProductItem.productId,
      productName: orderProductItem.productName,
      quantity: orderProductItem.quantity,
      unitPrice: orderProductItem.unitPrice,
      subtotal: orderProductItem.subtotal,
    });
  }

  static getPK(orderId: string): OrderProductItem.Keys['PK'] {
    return `ORDER#${orderId}`;
  }

  static getSK(orderProductId: string): OrderProductItem.Keys['SK'] {
    return `ORDERPRODUCT#${orderProductId}`;
  }

  static getGSI1PK(productId: string): OrderProductItem.Keys['GSI1PK'] {
    return `PRODUCT#${productId}`;
  }

  static getGSI1SK(orderProductId: string): OrderProductItem.Keys['GSI1SK'] {
    return `ORDERPRODUCT#${orderProductId}`;
  }
}

export namespace OrderProductItem {
  export type Keys = {
    PK: `ORDER#${string}`;
    SK: `ORDERPRODUCT#${string}`;
    GSI1PK: `PRODUCT#${string}`;
    GSI1SK: `ORDERPRODUCT#${string}`;
  };

  export type Attributes = {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  };

  export type ItemType = Keys & Attributes & {
    type: 'OrderProduct';
  };
}
