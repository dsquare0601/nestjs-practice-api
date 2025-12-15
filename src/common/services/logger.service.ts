import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends Logger {
  error(message: string, trace?: string, context?: string) {
    // Can integrate with external logging service (e.g., Winston, Sentry)
    super.error(message, trace, context);
    // await this.sendToExternalService({ message, trace, context });
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
  }

  log(message: string, context?: string) {
    super.log(message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
  }
}
