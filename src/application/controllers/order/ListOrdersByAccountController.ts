import { Controller } from '@application/contracts/Controller';
import { Order } from '@application/entities/Order';
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
  export type Response = {
    id: string;
    accountId: string;
    status: Order.Status;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    gatewayPaymentIntentId?: string;
    updatedAt: string;
    createdAt: string;
    orderProducts: OrderProductItem[];
  }[];

  export type OrderProductItem = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  };

  export type ShippingAddress = {
    name: string;
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
  };
}
