import {NextFunction, Request, Response} from "express";
import {ReasonPhrases} from "http-status-codes";
import {HttpError, ErrorFactory} from "../factories/errorFactory";
import {handleSequelizeError} from "../utils/errorHandlers/sequelizeErrorHandler";
import {handleHttpErrorResponse} from "../utils/errorHandlers/httpErrorResponseHandler";
import {handleJsonSyntaxError} from "../utils/errorHandlers/jsonErrorHandler";


function jsonSyntaxErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
    const jsonSyntaxError: HttpError | null = handleJsonSyntaxError(err);
    if (jsonSyntaxError) {
        console.error("Malformed JSON in request body:", err);
        return handleHttpErrorResponse(jsonSyntaxError, res);
    }
    next(err);
}

function httpErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        console.error("HttpError:", err);
        return handleHttpErrorResponse(err, res);
    }
    next(err);
}

function sequelizeErrorMiddleware(err: unknown, _req: Request, res: Response, next: NextFunction) {
    const sequelizeError: HttpError | null = handleSequelizeError(err);
    if (sequelizeError) {
        console.error("Sequelize Error:", err);
        return handleHttpErrorResponse(sequelizeError, res);
    }
    next(err);
}

function genericErrorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error("Unexpected Error:", err);
    const msg: string = err instanceof Error && err.message ? err.message : "An unexpected error occurred";
    const fallbackError: HttpError = ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, msg);
    handleHttpErrorResponse(fallbackError, res);
}

export const errorMiddlewares = [
    jsonSyntaxErrorMiddleware,
    httpErrorMiddleware,
    sequelizeErrorMiddleware,
    genericErrorMiddleware // this must be the last middleware to catch any unhandled errors (there isn't next for it)
];
