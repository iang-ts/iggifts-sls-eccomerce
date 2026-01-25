import { Product } from '@application/entities/Product';
import { ProductRepository } from '@infra/database/dynamo/repositories/ProductRepository';
import { ProductsFileStorageGateway } from '@infra/gateways/ProductsFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productsFileStorageGateway: ProductsFileStorageGateway,
  ) { }

  async execute(params: CreateProductUseCase.Input): Promise<CreateProductUseCase.Output> {
    const inputFileKey = ProductsFileStorageGateway.generateProductFileKey(
      params.file.inputType.split('/')[1],
    );

    const product = new Product({
      name: params.name,
      description: params.description,
      price: params.price,
      category: params.category,
      stockQuantity: params.stockQuantity,
      inputFileKey,
      isActive: params.isActive ?? true,
    });

    await this.productRepository.create(product);

    const { uploadSignature } = await this.productsFileStorageGateway.createPOST({
      productId: product.id,
      file: {
        key: inputFileKey,
        size: params.file.size,
        inputType: params.file.inputType,
      },
    });

    const imageUrl = this.productsFileStorageGateway.getFileUrl(inputFileKey);

    return {
      product,
      imageUrl,
      uploadSignature,
    };
  }
}

export namespace CreateProductUseCase {
  export type Input = {
    name: string;
    description: string;
    price: number;
    category: string;
    stockQuantity: number;
    file: {
      filename: string;
      size: number;
      inputType: string;
    };
    isActive?: boolean;
  };

  export type Output = {
    product: Product;
    imageUrl: string;
    uploadSignature: string;
  };
}
