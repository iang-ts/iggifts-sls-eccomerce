import { Controller } from '@application/contracts/Controller';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/Injectable';
import { ValidateRoles } from '@kernel/decorators/ValidateRoles';

@Injectable()
@ValidateRoles(['admins'])
export class ListRolesController extends Controller<'private', ListRolesController.Response[]> {
  constructor(private readonly authGateway: AuthGateway) {
    super();
  }

  protected override async handle(
    _params: Controller.Request<'private'>,
  ): Promise<Controller.Response<ListRolesController.Response[]>> {

    const { roles } = await this.authGateway.listRoles();

    return {
      statusCode: 200,
      body: roles,
    };
  }

}

export namespace ListRolesController {
  export type Response = {
    roleName?: string;
    description?: string;
    createdAt?: Date;
  }
}
