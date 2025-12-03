import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      // Exclude Swagger UI paths
      if (request?.originalUrl?.startsWith('/api/docs')) {
        // Let NestJS handle Swagger errors normally
        if (exception instanceof HttpException) {
          response.status(exception.getStatus()).send(exception.getResponse());
        } else {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
        }
        return;
      }

      const status =
        exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }
  }
}
