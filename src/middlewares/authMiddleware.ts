import { NextFunction, Request, Response } from 'express';
import { UserPayload, validateUserPayload } from '../utils/userPayload';
import { extractAndValidateJwtToken, getPublicJwtKey, jwtVerify } from '../utils/jwt';
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

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
        'Only administrators can access this resource'
    ));
};

export const gateOrAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === 'gate' || req.user?.role === 'admin') {
        return next();
    }
    return next(ErrorFactory.createError(
        ReasonPhrases.FORBIDDEN,
        'Only gate users or administrators can create a new transit'
    ));
}

