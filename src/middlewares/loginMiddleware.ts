import {body} from 'express-validator';
import {handleValidation} from "../utils/commonValidator";

const emailRegex = /^[a-zA-Z0-9._!?%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validation middleware for the `email` field in the request body.
 * Ensures the field exists, is a string, and matches the email format.
 * Also trims whitespace from the input.
 */
const emailValidation = body('email')
    .exists().withMessage('Field "email" in body is required')
    .bail()
    .isString().withMessage('Field "email" in body must be a string')
    .bail()
    .trim()
    .matches(emailRegex).withMessage('Field "email" in body must be a valid email address');

/**
 * Validation middleware for the `password` field in the request body.
 * Ensures the field exists and is a string.
 * Also trims whitespace from the input.
 */
const passwordValidation = body('password')
    .exists().withMessage('Field "password" in body is required')
    .bail()
    .isString().withMessage('Field "password" must be a string')
    .bail()
    .trim();

/**
 * Validation middleware for login requests.
 * Combines the `email` and `password` field validations with the validation handler.
 */
export const validateLogin = [
    emailValidation,
    passwordValidation,
    handleValidation,
];