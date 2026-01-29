import { Controller } from '@application/contracts/Controller';
import { ListActivesProductsUseCase } from '@application/usecases/product/ListActivesProductsUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListProductsController extends Controller<'private', ListProductsController.Response[]> {
  constructor(private readonly listProductsUseCase: ListActivesProductsUseCase) {
    super();
  }

  protected override async handle(
    _params: Controller.Request<'private'>,
  ): Promise<Controller.Response<ListProductsController.Response[]>> {
    const products = await this.listProductsUseCase.execute();

    return {
      statusCode: 200,
      body: products,
    };
  }
}

export namespace ListProductsController {
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
