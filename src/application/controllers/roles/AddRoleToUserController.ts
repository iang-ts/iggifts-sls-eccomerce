import { Controller } from '@application/contracts/Controller';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { ValidateRoles } from '@kernel/decorators/ValidateRoles';
import { AddRoleToUserBody, addRoleToUserSchema } from './schemas/addRoleToUserSchema ';

@Injectable()
@ValidateRoles(['admins'])
@Schema(addRoleToUserSchema)
export class AddRoleToUserController extends Controller<'private'> {
  constructor (private readonly authGateway: AuthGateway) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'private', AddRoleToUserBody>,
  ): Promise<Controller.Response> {

    const { roleName, email } = body;

    await this.authGateway.addRoleToUser({
      roleName,
      email,
    });

    return {
      statusCode: 200,
    };
  }

}
