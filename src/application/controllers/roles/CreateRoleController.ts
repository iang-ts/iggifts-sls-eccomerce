import { Controller } from '@application/contracts/Controller';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { ValidateRoles } from '@kernel/decorators/ValidateRoles';
import { CreateRoleBody, createRoleSchema } from './schemas/createRoleSchema';

@Injectable()
@ValidateRoles(['admins'])
@Schema(createRoleSchema)
export class CreateRoleController extends Controller<'private'> {
  constructor (private readonly authGateway: AuthGateway) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'private', CreateRoleBody>,
  ): Promise<Controller.Response> {

    const { roleName, description } = body;

    await this.authGateway.createRole({
      roleName,
      description,
    });

    return {
      statusCode: 201,
    };
  }

}
