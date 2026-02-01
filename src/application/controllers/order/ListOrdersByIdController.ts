import { Controller } from '@application/contracts/Controller';
import { Order } from '@application/entities/Order';
import { ListOrderByIdUseCase } from '@application/usecases/order/ListOrderByIdUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListOrderByIdController extends Controller<'private', ListOrderByIdController.Response> {
  constructor(private readonly listOrdersByAccountUseCase: ListOrderByIdUseCase) {
    super();
  }

  protected override async handle(
    { params }: Controller.Request<'private', Record<string, unknown>, ListOrderByIdController.params>,
  ): Promise<Controller.Response<ListOrderByIdController.Response>> {

    return {
      statusCode: 200,
      body: await this.listOrdersByAccountUseCase.execute(params.orderId),
    };
  }
}

export namespace ListOrderByIdController {
  export type params = {
    orderId: string
  }

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
  };

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
