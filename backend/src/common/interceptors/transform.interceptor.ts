import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      // Bypass Swagger endpoints (both with and without global prefix just in case)
      const url = request?.originalUrl;
      if (url?.startsWith('/docs') || url?.startsWith('/api/docs')) {
        return next.handle();
      }
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}
