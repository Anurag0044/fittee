import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    if (env.isProd) {
      return JSON.stringify({ timestamp, level, message, meta });
    }
    const color = {
      info: '\x1b[36m', // Cyan
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      debug: '\x1b[90m', // Gray
    }[level];
    const reset = '\x1b[0m';
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}${metaString}`;
  }

  info(message: string, meta?: unknown) {
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: unknown) {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, meta?: unknown) {
    console.error(this.formatMessage('error', message, meta));
  }

  debug(message: string, meta?: unknown) {
    if (env.isDev) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

export const logger = new Logger();
