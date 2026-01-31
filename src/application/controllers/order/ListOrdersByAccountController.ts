import { Controller } from '@application/contracts/Controller';
import { ListOrdersByAccountUseCase } from '@application/usecases/order/ListOrdersByAccountUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListOrdersByAccountController extends Controller<'private', ListOrdersByAccountController.Response> {
  constructor(private readonly listOrdersByAccountUseCase: ListOrdersByAccountUseCase) {
    super();
  }

  protected override async handle(
    { accountId }: Controller.Request<'private'>,
  ): Promise<Controller.Response<ListOrdersByAccountController.Response>> {
    return {
      statusCode: 200,
      body: await this.listOrdersByAccountUseCase.execute(accountId),
    };
  }
}

export namespace ListOrdersByAccountController {
  export type Response = any;
}
