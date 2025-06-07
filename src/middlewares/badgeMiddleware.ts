import {param, body, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';
import {BadgeStatus} from "../enum/badgeStatus";

/**
 * Validation middleware for the `id` parameter in the request.
 * Ensures the parameter exists, is a string, and is a valid UUIDv4.
 * Also trims the value to remove any leading or trailing whitespace.
 */
const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .bail()
    .isString().withMessage('Param "id" must be a string')
    .bail()
    .trim()
    .isUUID(4).withMessage('Param "id" must be a valid UUIDv4')
    .bail();

/**
 * Validation middleware for the `userId` field in the request body.
 * Ensures the field exists, is a string, and is a valid UUIDv4.
 * Also trims the value to remove any leading or trailing whitespace.
 */
const userIdValidation = body('userId')
    .exists().withMessage('Field "userId" is required')
    .bail()
    .isString().withMessage('Field "userId" must be a string')
    .bail()
    .isUUID(4).withMessage('Field "userId" must be a valid UUIDv4')
    .bail();

/**
 * Validation middleware for the `status` field in the request body.
 * Ensures the field is optional, is a string, and matches one of the valid `BadgeStatus` values.
 * Also converts the value to lowercase for consistency and trims it to remove any leading or trailing whitespace.
 */
const statusValidation = body('status')
    .optional()
    .isString().withMessage('Field "status" must be a string')
    .bail()
    .customSanitizer(value => value.toLowerCase())
    .trim()
    .isIn(Object.values(BadgeStatus)).withMessage(`Field "status" must be one of: ${Object.values(BadgeStatus).join(', ')}`)
    .bail();

/**
 * Validation middleware for the `unauthorizedAttempts` field in the request body.
 * Ensures the field is optional, is a number, and is a non-negative integer.
 * Also converts the value to an integer.
 */
const unauthorizedAttemptsValidation = body('unauthorizedAttempts')
    .optional()
    .bail()
    .custom((value) => typeof value === 'number')
    .withMessage('Field "unauthorizedAttempts" must be a number (also string number not allowed)')
    .bail()
    .isInt({min: 0})
    .withMessage('Field "unauthorizedAttempts" must be a non-negative integer')
    .bail()
    .toInt();

/**
 * Validation middleware for the `firstUnauthorizedAttempt` field in the request body.
 * Ensures the field is optional, is a string, and is a valid ISO 8601 date.
 */
const firstUnauthorizedAttemptValidation = body('firstUnauthorizedAttempt')
    .optional()
    .isString().withMessage('Field "firstUnauthorizedAttempt" must be a string')
    .bail()
    .isISO8601().withMessage('Must be a valid ISO 8601 date (Es. "2023-10-01T12:00:00Z")')
    .bail()
    .toDate();

/**
 * Validation middleware for the `badgeIds` field in the request body.
 * Ensures the field is a non-empty array.
 */
const validateBadgeIds = body('badgeIds')
    .notEmpty().withMessage('Field "badgeIds" is required and cannot be empty')
    .bail()
    .isArray({min: 1}).withMessage('Field "badgeIds" must be a non-empty array')
    .bail();

/**
 * Validation middleware for each element in the `badgeIds` array.
 * Ensures each element is a string and a valid UUIDv4.
 * Also trims the value to remove any leading or trailing whitespace.
 */
const validateBadgeIdsElement = body('badgeIds.*')
    .isString().withMessage('Each badge ID in badgeIds must be a string')
    .bail()
    .customSanitizer((value) => typeof value === 'string' ? value.trim() : value)
    .bail()
    .isUUID(4).withMessage('Each badge ID in badgeIds must be a valid UUIDv4')
    .bail();

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

        const formattedDetails = errors.array().map((e) => {
            return {
                field: e.type === 'field' ? e.path : 'unknown',
                message: e.msg ? e.msg : 'Unexpected validation error'
            };
        });

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
 * Validation middleware for badge creation.
 * Combines individual field validations and the validation handler.
 */
export const validateBadgeCreation = [
    userIdValidation,
    statusValidation,
    unauthorizedAttemptsValidation,
    firstUnauthorizedAttemptValidation,
    handleValidation
];

/**
 * Validation middleware for badge update.
 * Combines individual field validations and the validation handler.
 */
export const validateBadgeUpdate = [
    idParamValidation,
    statusValidation,
    unauthorizedAttemptsValidation,
    firstUnauthorizedAttemptValidation,
    handleValidation,
];

/**
 * Validation middleware for badge ID.
 * Combines the `id` parameter validation and the validation handler.
 */
export const validateBadgeId = [
    idParamValidation,
    handleValidation,
];

/**
 * Validation middleware for reactivating badges.
 * Combines validations for the `badgeIds` field and its elements, along with the validation handler.
 */
export const validateReactivateBadges = [
    validateBadgeIds,
    validateBadgeIdsElement,
    handleValidation
];