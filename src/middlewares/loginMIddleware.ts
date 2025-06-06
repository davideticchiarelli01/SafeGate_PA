import { ErrorFactory, HttpError } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes"
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const emailRegex = /^[a-zA-Z0-9._!?%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const emailValidation = body('email')
    .exists().withMessage('Field "email" is required')
    .bail()
    .isString().withMessage('Email must be a string')
    .trim()
    .matches(emailRegex).withMessage('Email format is invalid');

const passwordValidation = body('password')
    .exists().withMessage('Field "password" is required')
    .bail()
    .isString().withMessage('Passowrd must be a string');

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

export const validateLogin = [
    emailValidation,
    passwordValidation,
    handleValidation,
];