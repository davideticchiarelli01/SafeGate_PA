import {body} from 'express-validator';
import {BadgeStatus} from "../enum/badgeStatus";
import {
    handleValidation,
    isEnumField,
    isISODateField,
    isNonNegativeIntField,
    isUUIDField
} from "../utils/commonValidator";

/**
 * Validation middleware for the `badgeIds` field in the request body.
 * Ensures the field is a non-empty array.
 */
const badgeIdsValidation = body('badgeIds')
    .notEmpty().withMessage('Field "badgeIds" is required and cannot be empty')
    .bail()
    .isArray({min: 1}).withMessage('Field "badgeIds" must be a non-empty array')
    .bail();

/**
 * Validation middleware for each element in the `badgeIds` array.
 * Ensures each element is a string and a valid UUIDv4.
 * Also trims the value to remove any leading or trailing whitespace.
 */
const badgeIdsElementValidation = body('badgeIds.*')
    .isString().withMessage('Each badge ID in badgeIds must be a string')
    .bail()
    .customSanitizer((value) => typeof value === 'string' ? value.trim() : value)
    .bail()
    .isUUID(4).withMessage('Each badge ID in badgeIds must be a valid UUIDv4')
    .bail();

/**
 * Validation middleware for badge creation.
 * Combines individual field validations and the validation handler.
 */
export const validateBadgeCreation = [
    isUUIDField('userId', 'body'),
    isEnumField('status', Object.values(BadgeStatus), 'body', true),
    isNonNegativeIntField('unauthorizedAttempts', 'body', true),
    isISODateField('firstUnauthorizedAttempt', 'body', true),
    handleValidation
];

/**
 * Validation middleware for badge update.
 * Combines individual field validations and the validation handler.
 */
export const validateBadgeUpdate = [
    isUUIDField('id', 'param'),
    isEnumField('status', Object.values(BadgeStatus), 'body', true),
    isNonNegativeIntField('unauthorizedAttempts', 'body', true),
    isISODateField('firstUnauthorizedAttempt', 'body', true),
    handleValidation,
];

/**
 * Validation middleware for badge ID.
 * Combines the `id` parameter validation and the validation handler.
 */
export const validateBadgeId = [
    isUUIDField('id', 'param'),
    handleValidation,
];

/**
 * Validation middleware for reactivating badges.
 * Combines validations for the `badgeIds` field and its elements, along with the validation handler.
 */
export const validateReactivateBadges = [
    badgeIdsValidation,
    badgeIdsElementValidation,
    handleValidation
];