import { NextFunction, Request, Response } from 'express';
import { UserPayload, validateUserPayload } from '../utils/userPayload';
import { extractAndValidateJwtToken, getPublicJwtKey, jwtVerify } from '../utils/jwt';
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";
import { UserRole } from '../enum/userRoles';

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

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("req.user:", req.user);
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(ErrorFactory.createError(
        ReasonPhrases.FORBIDDEN,
        'Forbidden, administrators only can perform this action'
    ));
};

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

