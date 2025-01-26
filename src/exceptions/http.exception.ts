import ResourceToken from "../config/enums/resource-token.enum.js";
import StatusCode from "../utils/enums/status-code.enum.js";

export default class HttpException {
  constructor(
    readonly status: number,
    readonly token?: ResourceToken | ResourceToken[]
  ) {}
}

const createStatusException = (status: StatusCode) =>
  class extends HttpException {
    constructor(token?: ResourceToken | ResourceToken[]) {
      super(status, token);
    }
  };

export class BadRequestException extends createStatusException(
  StatusCode.BadRequest
) {}

export class UnauthorizedException extends createStatusException(
  StatusCode.Unauthorized
) {}

export class ForbiddenException extends createStatusException(
  StatusCode.Forbidden
) {}

export class NotFoundException extends createStatusException(
  StatusCode.NotFound
) {}

export class ConflictException extends createStatusException(
  StatusCode.Conflict
) {}
