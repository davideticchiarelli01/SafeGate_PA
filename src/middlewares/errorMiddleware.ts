import { NextFunction, Request, Response } from "express";
import { ReasonPhrases } from "http-status-codes";
import { HttpError, ErrorFactory } from "../factories/errorFactory";
import { handleSequelizeError } from "../utils/errorHandlers/sequelizeErrorHandler";
import { handleHttpErrorResponse } from "../utils/errorHandlers/httpErrorResponseHandler";
import { handleJsonSyntaxError } from "../utils/errorHandlers/jsonErrorHandler";

/**
 * Middleware to catch JSON syntax errors in the request body.
 * If a JSON syntax error is detected, returns a formatted error response.
 * Otherwise, passes the error to the next middleware.
 *
 * @param {unknown} err - The error object thrown by Express.
 * @param {Request} _req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
function jsonSyntaxErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
    const jsonSyntaxError: HttpError | null = handleJsonSyntaxError(err);
    if (jsonSyntaxError) {
        console.error("Malformed JSON in request body:", err);
        return handleHttpErrorResponse(jsonSyntaxError, res);
    }
    next(err);
}

/**
 * Middleware to handle custom HttpError instances.
 * If the error is an instance of HttpError, returns a formatted error response.
 * Otherwise, passes the error to the next middleware.
 *
 * @param {unknown} err - The error object thrown by Express.
 * @param {Request} _req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
function httpErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        console.error("HttpError:", err);
        return handleHttpErrorResponse(err, res);
    }
    next(err);
}

/**
 * Middleware to handle Sequelize (ORM) errors.
 * If a Sequelize error is detected, converts it to an HttpError and returns a formatted error response.
 * Otherwise, passes the error to the next middleware.
 *
 * @param {unknown} err - The error object thrown by Express.
 * @param {Request} _req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
function sequelizeErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
    const sequelizeError: HttpError | null = handleSequelizeError(err);
    if (sequelizeError) {
        console.error("Sequelize Error:", err);
        return handleHttpErrorResponse(sequelizeError, res);
    }
    next(err);
}

/**
 * Generic middleware to handle any unhandled errors.
 * Logs the error and returns a 500 Internal Server Error response.
 * This middleware should always be the last error handler in the chain.
 *
 * @param {unknown} err - The error object thrown by Express.
 * @param {Request} _req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @param {NextFunction} _next - The next middleware function (unused).
 */
function genericErrorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error("Unexpected Error:", err);
    const msg: string = err instanceof Error && err.message ? err.message : "An unexpected error occurred";
    const fallbackError: HttpError = ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, msg);
    handleHttpErrorResponse(fallbackError, res);
}

/**
 * Array of error-handling middlewares to be used in the Express app.
 * The order is important: from the most specific to the most generic.
 *
 * @type {Array<Function>}
 */
export const errorMiddlewares = [
    jsonSyntaxErrorMiddleware,   // Handles JSON syntax errors
    httpErrorMiddleware,         // Handles custom HttpError instances
    sequelizeErrorMiddleware,    // Handles Sequelize errors
    genericErrorMiddleware       // Handles any unhandled errors (must be last)
];