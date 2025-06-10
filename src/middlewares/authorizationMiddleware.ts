import {handleValidation, isUUIDField} from "../utils/commonValidator";

/**
 * Validation middleware for `badgeId` and `gateId` parameters.
 * Uses reusable UUID validators.
 */
export const validateAuthorizationIds = [
    isUUIDField('badgeId', 'param'),
    isUUIDField('gateId', 'param'),
    handleValidation,
];

/**
 * Validation middleware for `badgeId` and `gateId` fields in the request body.
 * Uses reusable UUID validators.
 */
export const validateAuthorizationCreation = [
    isUUIDField('badgeId', 'body'),
    isUUIDField('gateId', 'body'),
    handleValidation,
];
