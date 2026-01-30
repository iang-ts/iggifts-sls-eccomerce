import { Controller } from '@application/contracts/Controller';
import { CreateOrderUseCase } from '@application/usecases/order/createOrderUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { CreateOrderBody, createOrderSchema } from './schemas/createOrderSchema';

@Injectable()
@Schema(createOrderSchema)
export class CreateOrderController extends Controller<'private', CreateOrderController.Response> {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body }: Controller.Request<'private', CreateOrderBody>,
  ): Promise<Controller.Response<CreateOrderController.Response>> {
    const {
      products,
      address,
      cardNumber,
      cardMonth,
      cardYear,
      cardCvv,
    } = body;

    return {
      statusCode: 200,
      body: await this.createOrderUseCase.execute({
        accountId,
        products,
        address,
        cardNumber,
        cardMonth,
        cardYear,
        cardCvv,
      }),
    };
  }
}

export namespace CreateOrderController {
  export type Response = any;
}
