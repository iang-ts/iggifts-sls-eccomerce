import { Controller } from '@application/contracts/Controller';
import { CreateProductUseCase } from '@application/usecases/product/createProductUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { CreateProductBody, createProductSchema } from './schemas/createProductSchema';

@Injectable()
@Schema(createProductSchema)
export class CreateProductController extends Controller<'private', CreateProductController.Response> {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'private', CreateProductBody>,
  ): Promise<Controller.Response<CreateProductController.Response>> {
    const { name, price, description, category, stockQuantity, file } = body;

    const result = await this.createProductUseCase.execute({
      name,
      price,
      description,
      category,
      stockQuantity,
      file,
    });

    return {
      statusCode: 201,
      body: {
        message: 'Product was successfuly created',
        product: {
          id: result.product.id,
          imageUrl: result.imageUrl,
        },
        uploadSignature: result.uploadSignature,
      },
    };
  }
}

export namespace CreateProductController {
  export type Response = {
    message: string;
    product: {
      id: string;
      imageUrl: string;
    };
    uploadSignature: string;
  }
}
