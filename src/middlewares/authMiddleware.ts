import { NextFunction, Request, Response } from 'express';
import { UserPayload, validateUserPayload } from '../utils/userPayload';
import { extractAndValidateJwtToken, getPublicJwtKey, jwtVerify } from '../utils/jwt';
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";
import { UserRole } from '../enum/userRoles';

/**
 * Middleware to authenticate users via JWT.
 * Extracts the token from the Authorization header, verifies it,
 * validates the payload, and attaches the user to the request.
 *
 * @param {Request} req - Express request object containing the JWT
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader: string | undefined = req.headers['authorization'];
        const token: string = extractAndValidateJwtToken(authHeader);
        const publicKey: string = await getPublicJwtKey();
        const tmpPayload: UserPayload = jwtVerify<UserPayload>(token, publicKey);
        req.user = validateUserPayload(tmpPayload);
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware to restrict access to admin users only.
 * Checks the role of the authenticated user.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(ErrorFactory.createError(
        ReasonPhrases.FORBIDDEN,
        'Forbidden, administrators only can perform this action'
    ));
};

/**
 * Middleware to allow only gate users or admin users.
 * Checks if the role of the authenticated user is 'admin' or 'gate'.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const gateOrAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user && (req.user.role === UserRole.Gate || req.user?.role === UserRole.Admin)) {
        return next();
    }
    return next(ErrorFactory.createError(
        ReasonPhrases.FORBIDDEN,
        'Forbidden, only gate or admin users can perform this action'
    ));
}

/**
 * Middleware to allow only regular users or admin users.
 * Checks if the role of the authenticated user is 'admin' or 'user'.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const userOrAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user && (req.user.role === UserRole.User || req.user?.role === UserRole.Admin)) {
        return next();
    }
    return next(ErrorFactory.createError(
        ReasonPhrases.FORBIDDEN,
        'Forbidden, only users or administrators can perform this action'
    ));
}
