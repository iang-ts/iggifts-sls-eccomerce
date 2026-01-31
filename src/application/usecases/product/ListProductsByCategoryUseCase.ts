import { ListProductsByCategoryQuery } from '@application/query/ListProductsByCategoryQuery';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListProductsByCategoryUseCase {
  constructor(
    private readonly getAllActivesProductsQuery: ListProductsByCategoryQuery,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute(category: string): Promise<ListProductsByCategoryUseCase.Output[]> {

    const products = await this.getAllActivesProductsQuery.execute(category);

    return products.map(product => ({
      ...product,
      imageUrl: this.productsFileStorageGateway.getFileUrl(product.inputFileKey),
      createdAt: product.createdAt.toISOString(),
    }));
  }
}

export namespace ListProductsByCategoryUseCase {
  export type Output = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
  };
}
