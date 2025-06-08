import { getStatusCode, ReasonPhrases } from 'http-status-codes';

/**
 * Custom error class representing an HTTP error.
 * Extends the native JavaScript `Error` and includes additional HTTP-specific metadata.
 */
export class HttpError extends Error {
    statusCode: number;
    details?: object;

    /**
     * Constructs a new `HttpError`.
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {string} message - The error message.
     * @param {Error} [cause] - Optional underlying error that caused this one.
     * @param {object} [details] - Optional additional error details.
     */
    constructor(statusCode: number, message: string, cause?: Error, details?: object) {
        super(message, { cause });
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.details = details
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Factory class to simplify the creation of `HttpError` instances
 * based on standard HTTP reason phrases.
 */
export class ErrorFactory {

    /**
     * Creates an `HttpError` from a given HTTP reason phrase.
     * @param {ReasonPhrases} reason - The standard HTTP reason phrase.
     * @param {string} [message] - Optional custom message; defaults to the reason.
     * @param {Error} [cause] - Optional underlying cause of the error.
     * @param {object} [details] - Optional additional error metadata.
     * @returns {HttpError} - The constructed `HttpError` instance.
     */
    static createError(reason: ReasonPhrases, message?: string, cause?: Error, details?: object): HttpError {
        const statusCode: number = getStatusCode(reason);
        const msg: string = message ?? reason ?? 'Unknown error';
        return new HttpError(statusCode, msg, cause, details);
    }
}

