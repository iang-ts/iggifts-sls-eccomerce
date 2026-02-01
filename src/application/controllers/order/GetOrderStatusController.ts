import { Controller } from '@application/contracts/Controller';
import { Order } from '@application/entities/Order';
import { GetOrderStatusUseCase } from '@application/usecases/order/GetOrderStatusUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetOrderStatusController extends Controller<'private', GetOrderStatusController.Response> {
  constructor(private readonly getOrderStatusUseCase: GetOrderStatusUseCase) {
    super();
  }

  protected override async handle(
    { params }: Controller.Request<'private', Record<string, unknown>, GetOrderStatusController.params>,
  ): Promise<Controller.Response<GetOrderStatusController.Response>> {

    return {
      statusCode: 200,
      body: await this.getOrderStatusUseCase.execute(params.orderId),
    };
  }
}

export namespace GetOrderStatusController {
  export type params = {
    orderId: string
  }

  export type Response = {
    status: Order.Status;
  };
}
