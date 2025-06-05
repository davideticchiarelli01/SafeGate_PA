import {ReasonPhrases, StatusCodes} from "http-status-codes";
import {NextFunction, Request, Response} from "express";
import {ErrorFactory, HttpError} from "../factories/errorFactory";

const handleError = (err: HttpError, res: Response) => {
    const {statusCode, message} = err;

    res.status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        // message: 'Middleware: ' + message.replace(/&#39;/g, "'")
        message: message.replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'),
        details: err.details || {},
    });
};

const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorToHandle: HttpError;

    if (err instanceof HttpError) {
        errorToHandle = err;
    } else {
        errorToHandle = ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, 'Unknown error');
    }
    console.error('Error Middleware:', err);
    handleError(errorToHandle, res);
};

export default errorMiddleware;
