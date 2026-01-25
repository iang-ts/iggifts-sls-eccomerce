import KSUID from 'ksuid';

export class OrderProduct {
  readonly id: string;

  readonly orderId: string;

  readonly productId: string;

  productName: string;

  quantity: number;

  unitPrice: number;

  subtotal: number;

  constructor(attr: OrderProduct.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.orderId = attr.orderId;
    this.productId = attr.productId;
    this.productName = attr.productName;
    this.quantity = attr.quantity;
    this.unitPrice = attr.unitPrice;
    this.subtotal = attr.subtotal;
  }
}

export namespace OrderProduct {
  export type Attributes = {
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    id?: string;
  };
}
