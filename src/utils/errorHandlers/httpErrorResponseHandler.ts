import {Response} from "express";
import {StatusCodes} from "http-status-codes";
import {HttpError} from "../../factories/errorFactory";

export const handleHttpErrorResponse = (err: HttpError, res: Response) => {
    const {statusCode, message} = err;

    res.status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: message
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'),
        details: err.details || {},
    });
};
