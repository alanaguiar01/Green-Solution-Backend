import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { STATUS_CODES } from 'http';
import { Response } from 'express';
import * as _ from 'lodash';
@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = exception.getStatus();
    const rsp = <any>exception.getResponse();

    if (_.isArray(rsp.message) && rsp.message[0] instanceof ValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      const validationErrors = <ValidationError[]>rsp.message;
      this._validationFilter(validationErrors);
    }
    rsp.statusCode = statusCode;
    rsp.error = STATUS_CODES[statusCode];
    response.status(statusCode).json(rsp);
  }
  private _validationFilter(validationErrors: ValidationError[]) {
    for (const validationError of validationErrors) {
      for (const [constrainKey, constraint] of Object.entries(
        validationError.constraints,
      )) {
        if (!constraint) {
          validationError.constraints[constrainKey] =
            'error.fields.' + _.snakeCase(constrainKey);
        }
      }
      if (!_.isEmpty(validationError.children)) {
        this._validationFilter(validationError.children);
      }
    }
  }
}
