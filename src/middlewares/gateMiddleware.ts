import {DPI} from '../enum/dpi';
import {body} from 'express-validator';
import {handleValidation, isArrayField, isEnumArrayElements, isUUIDField} from "../utils/commonValidator";

/**
 * Validation for the `name` field in the request body.
 * Ensures the field is present, is a non-empty string after trimming.
 */
const nameValidation = body('name')
    .exists().withMessage('body field "name" is required')
    .bail()
    .isString().withMessage('body field "name" must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('body field "name" cannot be empty')
    .bail();

/**
 * Validation chain used when creating a new Gate.
 * Requires:
 * - name (non-empty string)
 * - optional requiredDPIs (must be an array of valid DPI strings)
 */
export const validateGateCreation = [
    nameValidation,
    isArrayField('requiredDPIs', 'body', true),
    isEnumArrayElements('requiredDPIs', Object.values(DPI), "body", true),
    handleValidation,
];

/**
 * Validation chain used when updating an existing Gate.
 * Requires:
 * - id param (valid UUIDv4)
 * - optional requiredDPIs (same rules as above)
 */
export const validateGateUpdate = [
    isUUIDField('id', 'param'),
    isArrayField('requiredDPIs', 'body', true),
    isEnumArrayElements('requiredDPIs', Object.values(DPI), "body", true),
    handleValidation,
];

/**
 * Validation used when a route only requires a Gate ID parameter.
 * Commonly used in GET, DELETE, or PATCH by ID.
 */
export const validateGateId = [
    isUUIDField('id', 'param'),
    handleValidation,
];
