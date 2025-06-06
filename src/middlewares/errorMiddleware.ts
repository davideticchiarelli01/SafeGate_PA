import {NextFunction, Request, Response} from "express";
import {ReasonPhrases} from "http-status-codes";
import {HttpError, ErrorFactory} from "../factories/errorFactory";
import {handleSequelizeError} from "../utils/errorHandlers/sequelizeErrorHandler";
import {handleHttpErrorResponse} from "../utils/errorHandlers/httpErrorResponseHandler";

const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorToHandle: HttpError;

    if (err instanceof HttpError) {
        errorToHandle = err;
    } else {
        const sequelizeError = handleSequelizeError(err);
        if (sequelizeError) {
            errorToHandle = sequelizeError;
        } else {
            errorToHandle = ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, "Unknown error");
        }
    }

    console.error("Error Middleware:", err);
    handleHttpErrorResponse(errorToHandle, res);
};

export default errorMiddleware;
