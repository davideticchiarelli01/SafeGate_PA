import { ReasonPhrases } from "http-status-codes";
import { ErrorFactory, HttpError } from "../../factories/errorFactory";

/**
 * Handles malformed JSON syntax errors in incoming requests.
 * If the error is a `SyntaxError` and related to the request body,
 * it returns a formatted `HttpError` with a 400 Bad Request status.
 *
 * @param {unknown} err - The error thrown.
 * @returns {HttpError | null} A `HttpError` if the error is a JSON syntax issue, otherwise `null`.
 */
export const handleJsonSyntaxError = (err: unknown): HttpError | null => {
    if (err instanceof SyntaxError && 'body' in err) {
        return ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, "Malformed JSON in request body");
    }
    return null;
};
