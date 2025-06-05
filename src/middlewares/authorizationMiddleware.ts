import {param, body, matchedData, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorFactory, HttpError} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';

const badgeIdParamValidation = param('badgeId')
    .exists().withMessage('Param "badgeId" is required')
    .trim()
    .isUUID(4).withMessage('Param "badgeId" must be a valid UUIDv4');

const gateIdParamValidation = param('gateId')
    .exists().withMessage('Param "gateId" is required')
    .trim()
    .isUUID(4).withMessage('Param "gateId" must be a valid UUIDv4');

const badgeIdBodyValidation = body('badgeId')
    .exists().withMessage('Field "badgeId" is required')
    .trim()
    .isUUID(4).withMessage('Field "badgeId" must be a valid UUIDv4');

const gateIdBodyValidation = body('gateId')
    .exists().withMessage('Field "gateId" is required')
    .trim()
    .isUUID(4).withMessage('Field "gateId" must be a valid UUIDv4');


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

export const validateAuthorizationDeletion = [
    badgeIdParamValidation,
    gateIdParamValidation,
    handleValidation,
];

export const validateAuthorizationCreation = [
    badgeIdBodyValidation,
    gateIdBodyValidation,
    handleValidation,
];