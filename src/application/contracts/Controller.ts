import { getSchema } from '@kernel/decorators/Schema';
import { getAllowedRoles } from '@kernel/decorators/ValidateRoles';
import { Forbidden } from '@application/errors/http/Forbidden';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';

type TRouteType = 'public' | 'private';

export abstract class Controller<TType extends TRouteType, TBody = undefined> {
  protected abstract handle(request: Controller.Request<TType>): Promise<Controller.Response<TBody>>;

  public execute(request: Controller.Request<TType>): Promise<Controller.Response<TBody>> {
    const body = this.validateBody(request.body);
    this.validateRoles(request);

    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody(body: Controller.Request<TType>['body']) {
    const schema = getSchema(this);

    if (!schema) {
      return body;
    }

    return schema.parse(body);
  }

  private validateRoles(request: Controller.Request<TType>) {
    const allowedRoles = getAllowedRoles(this);

    if (!allowedRoles || allowedRoles.length === 0) {
      return;
    }

    if ('headers' in request && request.headers) {
      const userRoles = this.extractRolesFromHeaders(request.headers);

      const hasPermission = allowedRoles.some(role => userRoles.includes(role));

      if (!hasPermission) {
        throw new Forbidden();
      }
    } else {
      throw new Forbidden();
    }
  }

  private extractRolesFromHeaders(headers: APIGatewayProxyEventHeaders): string[] {
    if (!headers?.authorization) {
      return [];
    }

    try {
      const [, payload] = headers.authorization.split('.');
      const claims = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf-8'),
      );

      return claims['cognito:groups'] ?? [];
    } catch {
      return [];
    }
  }
}

export namespace Controller {
  type BaseRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
  };

  type PublicRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = BaseRequest<TBody, TParams, TQueryParams> & {
    accountId: null;
  };

  type PrivateRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = BaseRequest<TBody, TParams, TQueryParams> & {
    accountId: string;
    headers: APIGatewayProxyEventHeaders | null;
  };

  export type Request<
    TType extends TRouteType,
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = TType extends 'public'
        ? PublicRequest<TBody, TParams, TQueryParams>
        : PrivateRequest<TBody, TParams, TQueryParams>;

  export type Response<TBody = undefined> = {
    statusCode: number;
    body?: TBody;
  };
}
