import {body, param, query, ValidationChain, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from "../factories/errorFactory";
import {ReasonPhrases} from "http-status-codes";

type ValidationLocation = 'body' | 'param' | 'query';

/**
 * Builds a validation chain for a specific field based on its location and optionality.
 *
 * @param field - The name of the field to validate.
 * @param location - The location of the field: 'body', 'param', or 'query'.
 * @param optional - Whether the field is optional.
 * @returns A configured ValidationChain for express-validator.
 */
const buildValidatorChain = (
    field: string,
    location: ValidationLocation,
    optional: boolean
): ValidationChain => {

    const source = location === 'body' ? body : location === 'param' ? param : query;
    let chain: ValidationChain = source(field);

    if (optional) {
        chain.optional();
    } else {
        chain.exists().withMessage(`Field "${field}" in ${location} is required`).bail();
    }

    return chain;
};

/**
 * Builds a validation chain for a UUIDv4 field.
 *
 * @param field - The name of the field to validate.
 * @param location - The location of the field: 'body', 'param', or 'query'.
 * @param optional - Whether the field is optional (default: false).
 * @returns A ValidationChain for express-validator.
 */
export const isUUIDField = (
    field: string,
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const chain: ValidationChain = buildValidatorChain(field, location, optional);

    return chain
        .isString().withMessage(`Field "${field}" in ${location} must be a string`)
        .bail()
        .trim()
        .isUUID(4).withMessage(`Field "${field}" in ${location} must be a valid UUIDv4`);
};


/**
 * Generates a validation chain for an ISO 8601 date field.
 * @param field - The name of the field.
 * @param location - The location of the field: 'body' or 'query'.
 * @param optional - Whether the field is optional (default: false).
 */
export const isISODateField = (
    field: string,
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const chain: ValidationChain = buildValidatorChain(field, location, optional);

    return chain
        .isString().withMessage(`Field "${field}" in ${location} must be a string`)
        .bail()
        .trim()
        .withMessage(`Field "${field}" in ${location} must be a valid ISO 8601 date (e.g., 2025-06-11T12:00:00Z or 2025-06-11T12:00:00+02:00)`)
        .bail()
        .toDate();
};

/**
 * Generates a validation chain for an enum field.
 * @param field - The name of the field.
 * @param enumValues - Array of valid enum values.
 * @param location - The location of the field: 'body' or 'query'.
 * @param optional - Whether the field is optional (default: false).
 */
export const isEnumField = (
    field: string,
    enumValues: any[],
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const chain: ValidationChain = buildValidatorChain(field, location, optional);

    return chain
        .isString().withMessage(`Field "${field}" in ${location} must be a string`)
        .bail()
        .trim()
        .toLowerCase()
        .isIn(enumValues).withMessage(`Field "${field}" in ${location} must be one of: ${enumValues.join(', ')}`);
};

/**
 * Generates a validation chain to check that a field is an array (if provided).
 *
 * @param field - The name of the field (e.g., 'requiredDPIs')
 * @param location - The location of the field: 'body' or 'query'
 * @param optional - Whether the field is optional (default: true)
 */
export const isArrayField = (
    field: string,
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const chain: ValidationChain = buildValidatorChain(field, location, optional);
    return chain
        .isArray().withMessage(`Field "${field}" in ${location} must be an array`)
        .bail();
};

/**
 * Validates each element of an array field against enum values.
 * @param field - The name of the array field (e.g., "requiredDPIs")
 * @param enumValues - Array of valid enum values
 * @param location - The location of the field: 'body' or 'query'
 * @param optional - Whether the field is optional (default: false)
 */
export const isEnumArrayElements = (
    field: string,
    enumValues: any[],
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const nestedField = `${field}.*`
    const chain: ValidationChain = buildValidatorChain(nestedField, location, optional);
    return chain
        .isString().withMessage(`Each item in "${field}" must be a string`)
        .bail()
        .trim()
        .toLowerCase()
        .isIn(enumValues)
        .withMessage(`Each item in "${field}" must be one of: ${enumValues.join(', ')}`);
};

/**
 * Generates a validation chain for a non-negative integer field.
 * @param field - The name of the field.
 * @param location
 * @param optional
 */
export const isNonNegativeIntField = (
    field: string,
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const chain: ValidationChain = buildValidatorChain(field, location, optional);
    return chain
        .custom(value => typeof value === 'number')
        .withMessage(`Field "${field}" in body must be a number (string numbers not allowed)`)
        .bail()
        .isInt({min: 0}).withMessage(`Field "${field}" in body must be  a non-negative integer`)
        .bail()
        .toInt();
};

/**
 * Generates a validation chain for a boolean field.
 * @param field - The name of the field.
 * @param location - The location of the field: 'body' or 'query'.
 * @param optional - Whether the field is optional (default: false).
 */
export const isBooleanField = (
    field: string,
    location: ValidationLocation,
    optional = false
): ValidationChain => {
    const chain: ValidationChain = buildValidatorChain(field, location, optional);
    return chain
        .isBoolean().withMessage(`Field "${field}" in body must be a boolean`)
        .bail()
        .toBoolean();
};

/**
 * Middleware to handle validation results.
 * Checks for validation errors and formats them into a structured response.
 * If validation fails, it creates an `HttpError` and passes it to the next middleware.
 * @param {Request} req - The Express request object.
 * @param _res - The Express response object (not used).
 * @param {NextFunction} next - The Express next middleware function.
 */
export const handleValidation = (req: Request, _res: Response, next: NextFunction): void => {
    const errors = validationResult(req); // Get validation errors from the request

    if (!errors.isEmpty()) {
        // If there are validation errors, format them
        const formattedDetails = errors.array().map((e) => {
            return {
                field: e.type === 'field' ? e.path : 'unknown',
                message: e.msg ? e.msg : 'Unexpected validation error'
            };
        });

        // Create an HttpError with the validation errors
        const error: HttpError = ErrorFactory.createError(
            ReasonPhrases.BAD_REQUEST,
            'Input validation failed',
            undefined,
            formattedDetails
        );

        // Pass the error to the next middleware
        return next(error);
    }

    // If validation passes, call the next middleware
    next();
};