/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpException extends Error {
  statusCode: number;
  error?: any;

  constructor(message: string, statusCode: number, error?: any) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", data?: any) {
    super(message, 400, data);
  }
}
export class ExistenceConflictException extends HttpException {
  constructor(message = "Already Exist", data?: any) {
    super(message, 409, data);
  }
}

export class NotAuthenticatedException extends HttpException {
  constructor(message = "Not Authenticated") {
    super(message, 401);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}
