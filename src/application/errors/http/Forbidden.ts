import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class Forbidden extends HttpError {
  public override statusCode = 403;

  public override code: ErrorCode;

  constructor(message?: string, code?: ErrorCode) {
    super();

    this.name = 'Forbidden';
    this.message = message ?? 'Forbidden';
    this.code = code ?? ErrorCode.FORBIDDEN;
  }
}
