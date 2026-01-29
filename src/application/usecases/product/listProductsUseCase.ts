import { GetAllActivesProductsQuery } from '@application/query/GetAllActivesProductsQuery';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListProductsUseCase {
  constructor(
    private readonly getAllActivesProductsQuery: GetAllActivesProductsQuery,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute(): Promise<ListProductsUseCase.Output[]> {

    const products = await this.getAllActivesProductsQuery.execute();

    return products.map(product => ({
      ...product,
      imageUrl: this.productsFileStorageGateway.getFileUrl(product.inputFileKey),
      createdAt: product.createdAt.toISOString(),
    }));
  }
}

export namespace ListProductsUseCase {
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
