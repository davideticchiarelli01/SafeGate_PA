import {param, body, query, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';
import {DPI} from "../enum/dpi";
import {TransitStatus} from "../enum/transitStatus";
import {ReportFormats} from "../enum/reportFormats";

/**
 * Validates the "id" route parameter.
 * Ensures it exists, is trimmed, and is a valid UUID v4.
 *
 * @param {Request} req - Express request containing the parameter
 */
const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .trim()
    .isUUID(4).withMessage('Param "id" must be a valid UUIDv4')
    .bail();

/**
 * Validates the "gateId" field in the request body.
 * Required and must be a valid UUID v4.
 *
 * @param {Request} req - Express request containing the field
 */
const gateIdValidation = body('gateId')
    .exists().withMessage('Field "gateId" is required')
    .trim()
    .isUUID(4).withMessage('Field "gateId" must be a valid UUIDv4')
    .bail();

/**
 * Validates the "badgeId" field in the request body.
 * Required and must be a valid UUID v4.
 *
 * @param {Request} req - Express request containing the field
 */
const badgeIdValidation = body('badgeId')
    .exists().withMessage('Field "badgeId" is required')
    .trim()
    .isUUID(4).withMessage('Field "badgeId" must be a valid UUIDv4')
    .bail();

/**
 * Validates the "badgeId" route parameter.
 * Required and must be a valid UUID v4.
 *
 * @param {Request} req - Express request containing the parameter
 */
const badgeIdParamValidation = param('badgeId')
    .exists().withMessage('Param "badgeId" is required')
    .trim()
    .isUUID(4).withMessage('Param "badgeId" must be a valid UUIDv4')
    .bail();

/**
 * Validates the optional "status" field in the request body.
 * Must be a string and one of the defined TransitStatus values.
 *
 * @param {Request} req - Express request containing the field
 */
const statusValidation = body('status')
    .optional()
    .isString().withMessage('Field "status" must be a string')
    .bail()
    .customSanitizer(value => value.toLowerCase())
    .isIn(Object.values(TransitStatus))
    .withMessage(`Field "status" must be one of: ${Object.values(TransitStatus).join(', ')}`);

/**
 * Validates the optional "DPIviolation" field in the request body.
 * Must be a boolean.
 *
 * @param {Request} req - Express request containing the field
 */
const DPIviolationValidation = body('DPIviolation')
    .optional()
    .isBoolean().withMessage('Field "DPIviolation" must be a boolean')
    .bail()
    .toBoolean();

/**
 * Validates the optional "usedDPIs" array in the request body.
 * Each element must be a valid DPI string (case-insensitive).
 *
 * @param {Request} req - Express request containing the field
 */
const usedDPIsValidation = body('usedDPIs')
    .optional()
    .isArray().withMessage('Field "usedDPIs" must be an array')
    .bail();

const usedDPIsElementsValidation = body('usedDPIs.*')
    .optional()
    .isString().withMessage('Each item in "usedDPIs" must be a string')
    .bail()
    .trim()
    .toLowerCase()
    .isIn(Object.values(DPI))
    .withMessage(`Each item in "usedDPIs" must be a valid DPI: ${Object.values(DPI).join(', ')}`);

/**
 * Validates the optional "gateId" query parameter.
 * Must be a valid UUID v4 if present.
 *
 * @param {Request} req - Express request containing the query
 */
const gateIdQueryValidation = query('gateId')
    .optional()
    .trim()
    .isUUID(4).withMessage('Query param "gateId" must be a valid UUIDv4')
    .bail();

/**
 * Validates the optional "startDate" query parameter.
 * Must be a valid ISO 8601 date string.
 *
 * @param {Request} req - Express request containing the query
 */
const startDateQueryValidation = query('startDate')
    .optional()
    .isISO8601().withMessage('Query param "startDate" must be a valid ISO 8601 date')
    .bail();

/**
 * Validates the optional "endDate" query parameter.
 * Must be a valid ISO 8601 date string.
 *
 * @param {Request} req - Express request containing the query
 */
const endDateQueryValidation = query('endDate')
    .optional()
    .isISO8601().withMessage('Query param "endDate" must be a valid ISO 8601 date')
    .bail();

/**
 * Validates the optional "format" query parameter.
 * Must be a string and one of the accepted ReportFormats.
 *
 * @param {Request} req - Express request containing the query
 */
const formatQueryValidation = query('format')
    .optional()
    .isString().withMessage('Query param "format" must be a string')
    .bail()
    .trim()
    .toLowerCase()
    .isIn(Object.values(ReportFormats))
    .withMessage(`Query param "format" must be one of: ${Object.values(ReportFormats).join(', ')}`);

/**
 * Middleware to handle validation results.
 * Checks for validation errors and formats them into a structured response.
 * If validation fails, it creates an `HttpError` and passes it to the next middleware.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
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
 * Validation chain for creating a Transit.
 */
export const validateTransitCreation = [
    gateIdValidation,
    badgeIdValidation,
    statusValidation,
    usedDPIsValidation,
    usedDPIsElementsValidation,
    DPIviolationValidation,
    handleValidation
];

/**
 * Validation chain for updating a Transit.
 */
export const validateTransitUpdate = [
    idParamValidation,
    statusValidation,
    usedDPIsValidation,
    usedDPIsElementsValidation,
    DPIviolationValidation,
    handleValidation,
];

/**
 * Validation chain for getting Transit statistics filtered by badge, gate, and date range.
 */
export const validateTransitStats = [
    badgeIdParamValidation,
    gateIdQueryValidation,
    startDateQueryValidation,
    endDateQueryValidation,
    handleValidation,
];

/**
 * Validation chain for validating a Transit ID parameter.
 */
export const validateTransitId = [
    idParamValidation,
    handleValidation,
];

/**
 * Validation chain for generating a gate report (includes date and format validation).
 */
export const validateGateReport = [
    formatQueryValidation,
    startDateQueryValidation,
    endDateQueryValidation,
    handleValidation,
];

/**
 * Validation chain for generating a badge report (includes date and format validation).
 */
export const validateBadgeReport = [
    formatQueryValidation,
    startDateQueryValidation,
    endDateQueryValidation,
    handleValidation,
];
