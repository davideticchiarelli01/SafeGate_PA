import {DPI} from '../enum/dpi';
import {param, body, validationResult} from 'express-validator';
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

const requiredDPIsValidation = body('requiredDPIs')
    .optional()
    .isArray().withMessage('Field "requiredDPIs" must be an array')
    .custom((arr) => arr.every((item: any) => typeof item === 'string'))
    .withMessage('Each element in "requiredDPIs" must be a string')
    .bail()
    .customSanitizer((arr: any[]) =>
        arr.map(item => typeof item === "string" ? item.trim().toLowerCase() : item)
    )
    .custom((arr) =>
        arr.every((item: any) => Object.values(DPI).includes(item))
    )
    .withMessage(`Field "requiredDPIs" must contain only valid DPI values: ${Object.values(DPI).join(', ')}`);

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

export const validateGateCreation = [
    nameValidation,
    requiredDPIsValidation,
    handleValidation
];

export const validateGateUpdate = [
    idParamValidation,
    requiredDPIsValidation,
    handleValidation,
];

export const validateGateId = [
    idParamValidation,
    handleValidation,
];
