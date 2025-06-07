import { DPI } from '../enum/dpi';
import { param, body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ErrorFactory, HttpError } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';

/**
 * Validation for the `id` route parameter.
 * Ensures the value is present, trimmed, and a valid UUIDv4.
 */
const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .trim()
    .isUUID(4).withMessage('Param "id" must be a valid UUIDv4')
    .bail();

/**
 * Validation for the `name` field in the request body.
 * Ensures the field is present, is a non-empty string after trimming.
 */
const nameValidation = body('name')
    .exists().withMessage('Field "name" is required')
    .bail()
    .isString().withMessage('Field "name" must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Field "name" cannot be empty')
    .bail();

/**
 * Validation for the optional `requiredDPIs` field in the request body.
 * - If present, must be an array of strings.
 * - Each element must be a valid DPI enum value.
 * - Trims and normalizes each string to lowercase before validation.
 */
const requiredDPIsValidation = body('requiredDPIs')
    .optional()
    .isArray().withMessage('Field "requiredDPIs" must be an array')
    .bail()
    .custom((arr) => arr.every((item: any) => typeof item === 'string'))
    .withMessage('Each element in "requiredDPIs" must be a string')
    .bail()
    .customSanitizer((arr: any[]) =>
        arr.map(item => typeof item === "string" ? item.trim().toLowerCase() : item)
    )
    .custom((arr) =>
        arr.every((item: any) => Object.values(DPI).includes(item))
    )
    .withMessage(`Field "requiredDPIs" must contain only valid DPI values: ${Object.values(DPI).join(', ')}`);

/**
 * Middleware to handle validation results.
 * Checks for validation errors and formats them into a structured response.
 * If validation fails, it creates an `HttpError` and passes it to the next middleware.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const handleValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedDetails = errors.array().map((e) => ({
            field: e.type === 'field' ? e.path : 'unknown',
            message: e.msg || 'Unexpected validation error',
        }));

        const error: HttpError = ErrorFactory.createError(
            ReasonPhrases.BAD_REQUEST,
            'Input validation failed',
            undefined,
            formattedDetails
        );

        return next(error);
    }
    next();
};

/**
 * Validation chain used when creating a new Gate.
 * Requires:
 * - name (non-empty string)
 * - optional requiredDPIs (must be array of valid DPI strings)
 */
export const validateGateCreation = [
    nameValidation,
    requiredDPIsValidation,
    handleValidation,
];

/**
 * Validation chain used when updating an existing Gate.
 * Requires:
 * - id param (valid UUIDv4)
 * - optional requiredDPIs (same rules as above)
 */
export const validateGateUpdate = [
    idParamValidation,
    requiredDPIsValidation,
    handleValidation,
];

/**
 * Validation used when a route only requires a Gate ID parameter.
 * Commonly used in GET, DELETE, or PATCH by ID.
 */
export const validateGateId = [
    idParamValidation,
    handleValidation,
];
