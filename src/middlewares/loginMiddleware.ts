import {ErrorFactory, HttpError} from "../factories/errorFactory";
import {ReasonPhrases} from "http-status-codes"
import {body, validationResult} from 'express-validator';
import {Request, Response, NextFunction} from 'express';

const emailRegex = /^[a-zA-Z0-9._!?%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validation middleware for the `email` field in the request body.
 * Ensures the field exists, is a string, and matches the email format.
 * Also trims whitespace from the input.
 */
const emailValidation = body('email')
    .exists().withMessage('Field "email" is required')
    .bail()
    .isString().withMessage('Email must be a string')
    .bail()
    .trim()
    .matches(emailRegex).withMessage('Email format is invalid');

/**
 * Validation middleware for the `password` field in the request body.
 * Ensures the field exists and is a string.
 * Also trims whitespace from the input.
 */
const passwordValidation = body('password')
    .exists().withMessage('Field "password" is required')
    .bail()
    .isString().withMessage('Password must be a string')
    .bail()
    .trim();

/**
 * Middleware to handle validation results.
 * Checks for validation errors and formats them into a structured response.
 * If validation fails, creates an `HttpError` and passes it to the next middleware.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
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

/**
 * Validation middleware for login requests.
 * Combines the `email` and `password` field validations with the validation handler.
 */
export const validateLogin = [
    emailValidation,
    passwordValidation,
    handleValidation,
];