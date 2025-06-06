import {getStatusCode, ReasonPhrases} from 'http-status-codes';

export class HttpError extends Error {
    statusCode: number;
    details?: object;

    constructor(statusCode: number, message: string, cause?: Error, details?: object) {
        super(message, {cause});
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.details = details
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ErrorFactory {
    static createError(reason: ReasonPhrases, message?: string, cause?: Error, details?: object): HttpError {
        const statusCode: number = getStatusCode(reason);
        const msg: string = message ?? reason ?? 'Unknown error';
        return new HttpError(statusCode, msg, cause, details);
    }

}

