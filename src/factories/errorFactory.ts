import { getStatusCode, ReasonPhrases, StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string, cause?: Error) {
        super(message, { cause });
        this.name = 'HttpError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ErrorFactory {
    static createError(reason: ReasonPhrases, message?: string, cause?: Error): HttpError {
        const statusCode: number = getStatusCode(reason);
        const msg: string = message ?? reason ?? 'Unknown error';
        return new HttpError(statusCode, msg, cause);
    }

}

