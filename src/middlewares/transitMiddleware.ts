import {DPI} from "../enum/dpi";
import {TransitStatus} from "../enum/transitStatus";
import {ReportFormats} from "../enum/reportFormats";
import {
    handleValidation,
    isArrayField,
    isBooleanField, isEnumArrayElements,
    isEnumField,
    isISODateField,
    isUUIDField
} from "../utils/commonValidator";

/**
 * Validation chain for creating a Transit.
 */
export const validateTransitCreation = [
    isUUIDField('gateId', 'body'),
    isUUIDField('badgeId', 'body'),
    isEnumField('status', Object.values(TransitStatus), 'body', true),
    isArrayField('usedDPIs', 'body', true),
    isEnumArrayElements('usedDPIs', Object.values(DPI), "body", true),
    isBooleanField('DPIviolation', 'body', true),
    handleValidation
];

/**
 * Validation chain for updating a Transit.
 */
export const validateTransitUpdate = [
    isUUIDField('id', 'param'),
    isEnumField('status', Object.values(TransitStatus), 'body', true),
    isArrayField('usedDPIs', 'body', true),
    isEnumArrayElements('usedDPIs', Object.values(DPI), "body", true),
    isBooleanField('DPIviolation', 'body', true),
    handleValidation,
];

/**
 * Validation chain for getting Transit statistics filtered by badge, gate, and date range.
 */
export const validateTransitStats = [
    isUUIDField('badgeId', 'param'),
    isUUIDField('gateId', 'query', true),
    isISODateField('startDate', 'query', true),
    isISODateField('endDate', 'query', true),
    handleValidation,
];

/**
 * Validation chain for validating a Transit ID parameter.
 */
export const validateTransitId = [
    isUUIDField('id', 'param'),
    handleValidation,
];

/**
 * Validation chain for generating a gate report (includes date and format validation).
 */
export const validateGateReport = [
    isEnumField('format', Object.values(ReportFormats), 'query', true),
    isISODateField('startDate', 'query', true),
    isISODateField('endDate', 'query', true),
    handleValidation,
];

/**
 * Validation chain for generating a badge report (includes date and format validation).
 */
export const validateBadgeReport = [
    isEnumField('format', Object.values(ReportFormats), 'query', true),
    isISODateField('startDate', 'query', true),
    isISODateField('endDate', 'query', true),
    handleValidation,
];
