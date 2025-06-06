import {ReasonPhrases} from "http-status-codes";
import {ErrorFactory, HttpError} from "../../factories/errorFactory";

export const handleJsonSyntaxError = (err: unknown): HttpError | null => {
    if (err instanceof SyntaxError && 'body' in err) {
        return ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, "Malformed JSON in request body");
    }
    return null;
};
