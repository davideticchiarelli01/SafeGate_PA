import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../factories/errorFactory";

/**
 * Handles the formatting and sending of HTTP error responses.
 * Replaces common HTML entities in the error message for readability.
 *
 * @param {HttpError} err - The custom HTTP error object containing status, message, and optional details.
 * @param {Response} res - The Express response object.
 */
export const handleHttpErrorResponse = (err: HttpError, res: Response) => {
    const { statusCode, message } = err;

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
