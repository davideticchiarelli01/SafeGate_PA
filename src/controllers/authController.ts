/**
 * AuthController class.
 * Handles HTTP requests related to user authentication (e.g., login).
 * Delegates logic to the AuthService.
 */

import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { StatusCodes } from "http-status-codes";

/**
 * Controller for authentication-related operations.
 */
export class AuthController {

    /**
     * Creates a new instance of AuthController.
     * @param {AuthService} authService - The service handling authentication logic.
     */
    constructor(private authService: AuthService) {
    }

    /**
     * Handles user login.
     * Expects `email` and `password` in the request body.
     * Returns a JWT token and user info on successful authentication.
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        try {
            const result: object = await this.authService.login(email, password);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

}

export default AuthController;
