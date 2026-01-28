import { Controller } from '@application/contracts/Controller';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { ValidateRoles } from '@kernel/decorators/ValidateRoles';
import { DeleteRoleBody, deleteRoleSchema } from './schemas/deleteRoleSchema';

@Injectable()
@ValidateRoles(['admins'])
@Schema(deleteRoleSchema)
export class DeleteRoleController extends Controller<'private'> {
  constructor (private readonly authGateway: AuthGateway) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'private', DeleteRoleBody>,
  ): Promise<Controller.Response> {

    const { roleName } = body;

    await this.authGateway.deleteRole(roleName);

    return {
      statusCode: 204,
    };
  }
}
