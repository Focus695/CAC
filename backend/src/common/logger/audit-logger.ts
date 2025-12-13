import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditLogger extends Logger {
  logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details?: any
  ) {
    const logMessage = JSON.stringify({
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      resourceId,
      details,
    });

    // Log to console (in production, we'd use a file or external service)
    this.log(logMessage);
  }
}
