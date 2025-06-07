import {param, body, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';

/**
 * Validation middleware for the `badgeId` parameter in the request.
 * Ensures the parameter exists, is a string, and is a valid UUIDv4.
 */
const badgeIdParamValidation = param('badgeId')
    .exists().withMessage('Param "badgeId" is required')
    .bail()
    .custom((value) => typeof value === 'string').withMessage('Param "badgeId" must be a string')
    .bail()
    .isUUID(4).withMessage('Param "badgeId" must be a valid UUIDv4');

/**
 * Validation middleware for the `gateId` parameter in the request.
 * Ensures the parameter exists, is a string, and is a valid UUIDv4.
 */
const gateIdParamValidation = param('gateId')
    .exists().withMessage('Param "gateId" is required')
    .bail()
    .custom((value) => typeof value === 'string').withMessage('Param "gateId" must be a string')
    .bail()
    .isUUID(4).withMessage('Param "gateId" must be a valid UUIDv4');

/**
 * Validation middleware for the `badgeId` field in the request body.
 * Ensures the field exists, is a string, and is a valid UUIDv4.
 */
const badgeIdBodyValidation = body('badgeId')
    .exists().withMessage('Field "badgeId" is required')
    .bail()
    .custom((value) => typeof value === 'string').withMessage('Field "badgeId" must be a string')
    .bail()
    .isUUID(4).withMessage('Field "badgeId" must be a valid UUIDv4');

/**
 * Validation middleware for the `gateId` field in the request body.
 * Ensures the field exists, is a string, and is a valid UUIDv4.
 */
const gateIdBodyValidation = body('gateId')
    .exists().withMessage('Field "gateId" is required')
    .bail()
    .custom((value) => typeof value === 'string').withMessage('Field "gateId" must be a string')
    .bail()
    .isUUID(4).withMessage('Field "gateId" must be a valid UUIDv4');

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
 * Validation middleware for `badgeId` and `gateId` parameters.
 * Combines individual parameter validations and the validation handler.
 */
export const validateAuthorizationIds = [
    badgeIdParamValidation,
    gateIdParamValidation,
    handleValidation,
];

/**
 * Validation middleware for `badgeId` and `gateId` fields in the request body.
 * Combines individual field validations and the validation handler.
 */
export const validateAuthorizationCreation = [
    badgeIdBodyValidation,
    gateIdBodyValidation,
    handleValidation,
];