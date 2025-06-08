import {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    DatabaseError,
    ConnectionError,
    ConnectionRefusedError,
    HostNotFoundError,
    HostNotReachableError,
    InvalidConnectionError,
    AccessDeniedError,
    TimeoutError
} from "sequelize";
import { ErrorFactory, HttpError } from "../../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";

/**
 * Handles various Sequelize-related errors and converts them into standardized `HttpError` objects.
 *
 * @param {unknown} err - The error object to inspect.
 * @returns {HttpError | null} A formatted `HttpError` if the error matches a known Sequelize error type, otherwise `null`.
 */
export const handleSequelizeError = (err: unknown): HttpError | null => {
    if (err instanceof UniqueConstraintError) {
        return ErrorFactory.createError(
            ReasonPhrases.CONFLICT,
            "Unique constraint error",
            undefined,
            { errors: err.errors.map(e => e.message) }
        );
    }

    if (err instanceof ValidationError) {
        return ErrorFactory.createError(
            ReasonPhrases.BAD_REQUEST,
            "Validation error",
            undefined,
            { errors: err.errors.map(e => e.message) }
        );
    }

    if (err instanceof ForeignKeyConstraintError) {
        return ErrorFactory.createError(
            ReasonPhrases.BAD_REQUEST,
            "Foreign key constraint failed",
            undefined,
            {
                table: err.table,
                fields: err.fields,
                value: err.value,
                index: err.index,
            }
        );
    }

    if (err instanceof DatabaseError) {
        return ErrorFactory.createError(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            "Database error",
            undefined,
            {
                message: err.message,
                sql: err.sql
            }
        );
    }

    if (
        err instanceof ConnectionError ||
        err instanceof ConnectionRefusedError ||
        err instanceof HostNotFoundError ||
        err instanceof HostNotReachableError ||
        err instanceof InvalidConnectionError ||
        err instanceof AccessDeniedError ||
        err instanceof TimeoutError
    ) {
        return ErrorFactory.createError(
            ReasonPhrases.SERVICE_UNAVAILABLE,
            "Database connection error",
            undefined,
            {
                type: err.name,
                message: err.message
            }
        );
    }

    return null;
};
