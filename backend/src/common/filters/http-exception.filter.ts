import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      // DO NOT JSON-format Swagger UI paths - they should return CSS/JS with proper MIME types
      if (request?.originalUrl?.startsWith('/docs')) {
        // For HTTP exceptions, use default NestJS error handling
        if (exception instanceof HttpException) {
          // Send the raw error response without JSON formatting
          const status = exception.getStatus();
          const res = exception.getResponse();

          // If it's a string, send as text/plain
          if (typeof res === 'string') {
            response.status(status).type('text/plain').send(res);
            return;
          }

          // If it's an object with a message, send as text/plain
          if (typeof res === 'object' && res && 'message' in res && typeof res.message === 'string') {
            response.status(status).type('text/plain').send(res.message);
            return;
          }

          // Otherwise, send as JSON for API error consistency (though this shouldn't happen for Swagger paths)
          response.status(status).json(res);
          return;
        }

        // For non-HTTP exceptions, send a generic text response
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).type('text/plain').send('Internal server error');
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
