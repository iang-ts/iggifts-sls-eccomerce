import KSUID from 'ksuid';

export class Order {
  readonly id: string;

  readonly accountId: string;

  status: Order.Status;

  totalAmount: number;

  shippingAddress: Order.ShippingAddress;

  gatewayPaymentIntentId?: string;

  updatedAt: Date;

  readonly createdAt: Date;

  constructor(attr: Order.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.status = attr.status;
    this.totalAmount = attr.totalAmount;
    this.shippingAddress = attr.shippingAddress;
    this.gatewayPaymentIntentId = attr.gatewayPaymentIntentId ?? '';
    this.updatedAt = attr.updatedAt ?? new Date();
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Order {
  export type Attributes = {
    accountId: string;
    status: Status;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    gatewayPaymentIntentId?: string;
    id?: string;
    updatedAt?: Date;
    createdAt?: Date;
  };

  export type ShippingAddress = {
    name: string;
    street: string;
    number: string;
    state: string;
    postalCode: string;
  };

  export enum Status {
    PENDING ='pending',
    PROCESSING ='processing',
    RECUSED = 'recused',
    PAID ='paid',
    SHIPPED ='shipped',
    DELIVERD ='delivered',
    CANCELLED ='cancelled',
  }
}
