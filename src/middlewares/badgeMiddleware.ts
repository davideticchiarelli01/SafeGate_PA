import { param, body, matchedData, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ErrorFactory, HttpError } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';
import { BadgeStatus } from "../enum/badgeStatus";

const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .trim()
    .isUUID(4).withMessage('Param "id" must be a valid UUIDv4');

const userIdValidation = body('userId')
    .exists().withMessage('Field "userId" is required')
    .trim()
    .isUUID(4).withMessage('Field "userId" must be a valid UUIDv4');

const statusValidation = body('status')
    .optional()
    .isString().withMessage('Field "status" must be a string')
    .trim()
    .customSanitizer(value => value.toLowerCase())
    .isIn(Object.values(BadgeStatus)).withMessage(`Field "status" must be one of: ${Object.values(BadgeStatus).join(', ')}`);

const unauthorizedAttemptsValidation = body('unauthorizedAttempts')
    .optional()
    .isInt({ min: 0 }).withMessage('Field "unauthorizedAttempts" must be a non-negative integer')
    .toInt();

const firstUnauthorizedAttemptValidation = body('firstUnauthorizedAttempt')
    .optional()
    .isISO8601().withMessage('Must be a valid ISO 8601 date (Es. "2023-10-01T12:00:00Z")')
    .toDate();

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


export const validateBadgeCreation = [
    userIdValidation,
    statusValidation,
    unauthorizedAttemptsValidation,
    firstUnauthorizedAttemptValidation,
    handleValidation
];

export const validateBadgeUpdate = [
    idParamValidation,
    statusValidation,
    unauthorizedAttemptsValidation,
    firstUnauthorizedAttemptValidation,
    handleValidation,
];

export const validateBadgeId = [
    idParamValidation,
    handleValidation,
];

export const validateReactivateBadges = [
    body('badgeIds')
        .notEmpty().withMessage('Field "badgeIds" is required and cannot be empty')
        .isArray({ min: 1 }).withMessage('Field "badgeIds" must be a non-empty array'),

    body('badgeIds.*')
        .isString().withMessage('Each badge ID in badgeIds must be a string')
        .customSanitizer((value) => typeof value === 'string' ? value.trim() : value)
        .isUUID(4).withMessage('Each badge ID in badgeIds must be a valid UUIDv4'),
    handleValidation
];