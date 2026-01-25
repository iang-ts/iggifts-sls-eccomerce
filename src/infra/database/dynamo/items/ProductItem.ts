import { Product } from '@application/entities/Product';

export class ProductItem {
  private readonly type = 'Product';

  private readonly keys: ProductItem.Keys;

  constructor(private readonly attrs: ProductItem.Attributes) {
    this.keys = {
      PK: ProductItem.getPK(this.attrs.id),
      SK: ProductItem.getSK(this.attrs.id),
      GSI1PK: ProductItem.getGSI1PK(),
      GSI1SK: ProductItem.getGSI1SK(this.attrs.id),
      GSI2PK: ProductItem.getGSI2PK(this.attrs.category),
      GSI2SK: ProductItem.getGSI2SK(this.attrs.id),
    };
  }

  toItem(): ProductItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static fromEntity(product: Product) {
    return new ProductItem({
      ...product,
      createdAt: product.createdAt.toISOString(),
    });
  }

  static toEntity(productItem: ProductItem.ItemType) {
    return new Product({
      id: productItem.id,
      name: productItem.name,
      description: productItem.description,
      price: productItem.price,
      category: productItem.category,
      inputFileKey: productItem.inputFileKey,
      stockQuantity: productItem.stockQuantity,
      isActive: productItem.isActive,
      createdAt: new Date(productItem.createdAt),
    });
  }

  static getPK(productId: string): ProductItem.Keys['PK'] {
    return `PRODUCT#${productId}`;
  }

  static getSK(productId: string): ProductItem.Keys['SK'] {
    return `PRODUCT#${productId}`;
  }

  static getGSI1PK(): ProductItem.Keys['GSI1PK'] {
    return 'PRODUCT#ACTIVE';
  }

  static getGSI1SK(id: string): ProductItem.Keys['GSI1SK'] {
    return `PRODUCT#${id}`;
  }

  static getGSI2PK(category: string): ProductItem.Keys['GSI2PK'] {
    return `PRODUCT#${category}`;
  }

  static getGSI2SK(id: string): ProductItem.Keys['GSI2SK'] {
    return `PRODUCT#${id}`;
  }
}

export namespace ProductItem {
  export type Keys = {
    PK: `PRODUCT#${string}`;
    SK: `PRODUCT#${string}`;
    GSI1PK: `PRODUCT#${string}`;
    GSI1SK: `PRODUCT#${string}`;
    GSI2PK: `PRODUCT#${string}`;
    GSI2SK: `PRODUCT#${string}`;
  };

  export type Attributes = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inputFileKey: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Product';
  };
}
