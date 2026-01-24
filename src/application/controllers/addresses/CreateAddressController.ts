import { Controller } from '@application/contracts/Controller';
import { CreateAddressUseCase } from '@application/usecases/addresses/CreateAddressUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { CreateAddressBody, createAddressSchema } from './schemas/createAddressSchema';

@Injectable()
@Schema(createAddressSchema)
export class CreateAddressController extends Controller<'private', CreateAddressController.Response> {
  constructor(private readonly createAddressUseCase: CreateAddressUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body }: Controller.Request<'private', CreateAddressBody>,
  ): Promise<Controller.Response<CreateAddressController.Response>> {
    const { address } = body;

    await this.createAddressUseCase.execute({
      accountId, address,
    });

    return {
      statusCode: 201,
      body: {
        message: 'Address was successfuly created',
      },
    };
  }
}

export namespace CreateAddressController {
  export type Response = {
    message: string;
  }
}
