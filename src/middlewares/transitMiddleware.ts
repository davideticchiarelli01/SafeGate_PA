import { param, body, query, matchedData, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ErrorFactory, HttpError } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';
import { DPI } from "../enum/dpi";
import { TransitStatus } from "../enum/transitStatus";
import { ReportFormats } from "../enum/reportFormats";

const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .trim()
    .isUUID(4).withMessage('Param "id" must be a valid UUIDv4');

const gateIdValidation = body('gateId')
    .exists().withMessage('Field "gateId" is required')
    .trim()
    .isUUID(4).withMessage('Field "gateId" must be a valid UUIDv4');

const badgeIdValidation = body('badgeId')
    .exists().withMessage('Field "badgeId" is required')
    .trim()
    .isUUID(4).withMessage('Field "badgeId" must be a valid UUIDv4');

const badgeIdParamValidation = param('badgeId')
    .exists().withMessage('Param "badgeId" is required')
    .trim()
    .isUUID(4).withMessage('Param "badgeId" must be a valid UUIDv4');

const statusValidation = body('status')
    .optional()
    .isString().withMessage('Field "status" must be a string')
    .trim()
    .customSanitizer(value => value.toLowerCase())
    .isIn(Object.values(TransitStatus))
    .withMessage(`Field "status" must be one of: ${Object.values(TransitStatus).join(', ')}`);

const DPIviolationValidation = body('DPIviolation')
    .optional()
    .isBoolean().withMessage('Field "DPIviolation" must be a boolean')
    .toBoolean();

const usedDPIsValidation = body('usedDPIs')
    .optional()
    .isArray().withMessage('Field "requiredDPIs" must be an array')
    .customSanitizer((arr) =>
        Array.isArray(arr) ? arr.map((item) => String(item).trim().toLowerCase()) : [])
    .custom((arr) =>
        Array.isArray(arr) && arr.every(item => Object.values(DPI).includes(item))
    )
    .withMessage(`Field "requiredDPIs" must contain only valid DPI values: ${Object.values(DPI).join(', ')}`);


const gateIdQueryValidation = query('gateId')
    .optional()
    .trim()
    .isUUID(4).withMessage('Query param "gateId" must be a valid UUIDv4');

const startDateQueryValidation = query('startDate')
    .optional()
    .isISO8601().withMessage('Query param "startDate" must be a valid ISO 8601 date');

const endDateQueryValidation = query('endDate')
    .optional()
    .isISO8601().withMessage('Query param "endDate" must be a valid ISO 8601 date');

const formatQueryValidation = query('format')
    .optional()
    .isString().withMessage('Query param "format" must be a string')
    .trim()
    .toLowerCase()
    .isIn(Object.values(ReportFormats))
    .withMessage(`Query param "format" must be one of: ${Object.values(ReportFormats).join(', ')}`);

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


export const validateTransitCreation = [
    gateIdValidation,
    badgeIdValidation,
    statusValidation,
    usedDPIsValidation,
    DPIviolationValidation,
    handleValidation
];

export const validateTransitUpdate = [
    idParamValidation,
    statusValidation,
    usedDPIsValidation,
    DPIviolationValidation,
    handleValidation,
];

export const validateTransitStats = [
    badgeIdParamValidation,
    gateIdQueryValidation,
    startDateQueryValidation,
    endDateQueryValidation,
    handleValidation,
];

export const validateTransitId = [
    idParamValidation,
    handleValidation,
];

export const validateGateReport = [
    formatQueryValidation,
    startDateQueryValidation,
    endDateQueryValidation,
    handleValidation,
];

export const validateBadgeReport = [
    formatQueryValidation,
    startDateQueryValidation,
    endDateQueryValidation,
    handleValidation,
];