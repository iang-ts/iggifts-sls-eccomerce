import { Controller } from '@application/contracts/Controller';
import { ListProductsByCategoryUseCase } from '@application/usecases/product/ListProductsByCategoryUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListProductsByCategoryController extends Controller<'public', ListProductsByCategoryController.Response[]> {
  constructor(private readonly listProductsByCategoryUseCase: ListProductsByCategoryUseCase) {
    super();
  }

  protected override async handle(
    { params }: Controller.Request<'public', Record<string, unknown>, ListProductsByCategoryController.Params>,
  ): Promise<Controller.Response<ListProductsByCategoryController.Response[]>> {

    const products = await this.listProductsByCategoryUseCase.execute(params.category);

    return {
      statusCode: 200,
      body: products,
    };
  }
}

export namespace ListProductsByCategoryController {
  export type Params = {
    category: string;
  };

  export type Response = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
  }
}
