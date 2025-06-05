import {DPI} from '../enum/dpi';
import {param, body, matchedData, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';

const idParamValidation = param('id')
    .exists().withMessage('Param "id" is required')
    .trim()
    .isUUID(4).withMessage('Param "id" must be a valid UUIDv4');

const nameValidation = body('name')
    .exists().withMessage('Field "name" is required')
    .isString().withMessage('Field "name" must be a string')
    .trim()
    .notEmpty().withMessage('Field "name" cannot be empty')

const DPIsValidation = body('requiredDPIs')
    .optional()
    .isArray().withMessage('Field "requiredDPIs" must be an array')
    .customSanitizer((arr) => Array.isArray(arr) ? arr.map((item: string) => item.trim().toLowerCase()) : [])
    .custom((arr) => Array.isArray(arr) && arr.every(item => Object.values(DPI).includes(item)))
    .withMessage(`Field "requiredDPIs" must contain only valid DPI values: ${Object.values(DPI).join(', ')}`)

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
    // req.body = matchedData(req, {locations: ['body']});
    // req.params = matchedData(req, {locations: ['params']});
    // req.query = matchedData(req, {locations: ['query']});
    next();
};

export const validateGateCreation = [
    nameValidation,
    DPIsValidation,
    handleValidation
];

export const validateGateUpdate = [
    idParamValidation,
    DPIsValidation,
    handleValidation,
];

export const validateGateId = [
    idParamValidation,
    handleValidation,
];
