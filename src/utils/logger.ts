/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from "winston";
import dayjs from "dayjs";
import { LOG_LEVEL } from "../config/env";

const { combine, timestamp, printf } = winston.format;

export const createWinstonLogger = (context = "APP") => {
  const printFormat = printf(
    ({ level, message, timestamp, context, ...meta }) => {
      return `${timestamp} ${level.toUpperCase()} [${context}]: ${message} ${
        typeof meta === "object" ? JSON.stringify(meta, null, 2) : meta
      }`;
    },
  );
  return winston.createLogger({
    format: combine(
      timestamp({
        format: () => dayjs().format(),
      }),
      printFormat,
    ),
    transports: [new winston.transports.Console({ level: LOG_LEVEL })],
    defaultMeta: {
      context,
    },
  });
};

const winstonLogger = createWinstonLogger();

// A direct copy from https://github.com/gremo/nest-winston/blob/main/src/winston.classes.ts
export class Logger {
  private context?: string;
  private logger = winstonLogger;

  constructor(context = "APP") {
    this.context = context;
  }

  public setContext(context: string) {
    this.context = context;
  }

  public log(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && "object" === typeof message) {
      const { message: msg, level = "info", ...meta } = message;

      return this.logger.log(level, msg as string, { context, ...meta });
    }

    return this.logger.info(message, { context });
  }

  public info(message: any, context?: string): any {
    console.log("info")
    context = context || this.context;

      return this.log(message, context);
  }

  public fatal(message: any, trace?: string, context?: string): any {
    console.log("fatal")
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.log({
        level: "fatal",
        message: msg,
        context,
        stack: [trace || stack],
        error: message,
        ...meta,
      });
    }

    if (!!message && "object" === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error({
        level: "fatal",
        message: msg,
        context,
        stack: [trace],
        ...meta,
      });
    }

    return this.logger.error({
      level: "fatal",
      message,
      context,
      stack: [trace],
    });
  }

  public error(message: any, trace?: string, context?: string): any {
    console.log("error")
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.error(msg, {
        context,
        stack: [trace || message.stack],
        error: message,
        ...meta,
      });
    }

    if (!!message && "object" === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, {
        context,
        stack: [trace],
        ...meta,
      });
    }

    return this.logger.error(message, { context, stack: [trace] });
  }

  public warn(message: any, context?: string): any {
    console.log("warn")
    context = context || this.context;

    if (!!message && "object" === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { context, ...meta });
    }

    return this.logger.warn(message, { context });
  }

  public debug(message: any, context?: string): any {
    console.log("debug")
    context = context || this.context;

    if (!!message && "object" === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { context, ...meta });
    }

    return this.logger.debug(message, { context });
  }

  public verbose(message: any, context?: string): any {
    console.log("verbose")
    context = context || this.context;

    if (!!message && "object" === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { context, ...meta });
    }

    return this.logger.verbose(message, { context });
  }

  public getWinstonLogger() {
    return this.logger;
  }
}
