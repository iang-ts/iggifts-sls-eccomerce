import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class NotFound extends HttpError {
  public override statusCode = 404;

  public override code: ErrorCode;

  constructor(message?: string, code?: ErrorCode) {
    super();

    this.name = 'NotFound';
    this.message = message ?? 'Resource not found';
    this.code = code ?? ErrorCode.PRODUCT_NOT_FOUND;
  }
}
