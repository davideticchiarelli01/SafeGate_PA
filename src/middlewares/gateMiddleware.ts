import {DPI} from '../enum/dpi';
import {param, body, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';

/**
 * Validation for the `id` route parameter.
 * Ensures the value is present, trimmed, and a valid UUIDv4.
 */
const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .isString()
    .bail()
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
 * Validation middleware for the `requiredDPIs` field in the request body.
 * Ensures the field is optional and, if provided, is an array.
 */
const requiredDPIsValidation = body('requiredDPIs')
    .optional()
    .isArray().withMessage('Field "requiredDPIs" must be an array')
    .bail();

/**
 * Validation middleware for each element in the `requiredDPIs` array.
 * Ensures each element is optional, a string and matches one of the
 * valid DPI values defined in the `DPI` enum.
 *
 * Each string is trimmed, converted to lowercase, and validated against the enum.
 */
const requiredDPIsElementsValidation = body('requiredDPIs.*')
    .optional()
    .isString().withMessage('Each item in "requiredDPIs" must be a string')
    .bail()
    .trim()
    .toLowerCase()
    .isIn(Object.values(DPI))
    .withMessage(`Each item in "requiredDPIs" must be a valid DPI: ${Object.values(DPI).join(', ')}`)
    .bail();

/**
 * Middleware to handle validation results.
 * Checks for validation errors and formats them into a structured response.
 * If validation fails, it creates an `HttpError` and passes it to the next middleware.
 * @param {Request} req - The Express request object.
 * @param {Response} _res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const handleValidation = (req: Request, _res: Response, next: NextFunction) => {
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
 * - optional requiredDPIs (must be an array of valid DPI strings)
 */
export const validateGateCreation = [
    nameValidation,
    requiredDPIsValidation,
    requiredDPIsElementsValidation,
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
    requiredDPIsElementsValidation,
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
