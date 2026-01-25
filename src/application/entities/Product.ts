import KSUID from 'ksuid';

export class Product {
  readonly id: string;

  name: string;

  description: string;

  price: number;

  category: string;

  inputFileKey: string;

  stockQuantity: number;

  isActive: boolean;

  readonly createdAt: Date;

  constructor(attr: Product.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.name = attr.name;
    this.description = attr.description;
    this.price = attr.price;
    this.category = attr.category;
    this.inputFileKey = attr.inputFileKey;
    this.stockQuantity = attr.stockQuantity;
    this.isActive = attr.isActive;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Product {
  export type Attributes = {
    name: string;
    description: string;
    price: number;
    category: string;
    inputFileKey: string;
    stockQuantity: number;
    isActive: boolean;
    id?: string;
    createdAt?: Date;
  };
}
