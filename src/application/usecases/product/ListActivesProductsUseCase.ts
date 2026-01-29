import { ListActivesProductsQuery } from '@application/query/ListActivesProductsQuery';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListActivesProductsUseCase {
  constructor(
    private readonly getAllActivesProductsQuery: ListActivesProductsQuery,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute(): Promise<ListActivesProductsUseCase.Output[]> {

    const products = await this.getAllActivesProductsQuery.execute();

    return products.map(product => ({
      ...product,
      imageUrl: this.productsFileStorageGateway.getFileUrl(product.inputFileKey),
      createdAt: product.createdAt.toISOString(),
    }));
  }
}

export namespace ListActivesProductsUseCase {
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
