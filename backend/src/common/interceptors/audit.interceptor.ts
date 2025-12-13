import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogger } from '../logger/audit-logger';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditLogger: AuditLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userId = request.user?.userId;
    const action = request.method;
    const url = request.url;
    const resource = url.split('/')[2]; // e.g., /admin/users -> users
    const resourceId = url.split('/')[3]; // e.g., /admin/users/123 -> 123

    return next.handle().pipe(
      tap(() => {
        if (url.startsWith('/admin/')) {
          this.auditLogger.logAction(
            userId,
            action,
            resource,
            resourceId || 'all',
            { status: response.statusCode }
          );
        }
      })
    );
  }
}
