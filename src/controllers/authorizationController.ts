import {NextFunction, Request, Response} from 'express';
import {AuthorizationService} from '../services/authorizationService';
import {StatusCodes} from 'http-status-codes';
import {Authorization, AuthorizationCreationAttributes} from "../models/authorization";
import {matchedData} from "express-validator";

export class AuthorizationController {
    constructor(private service: AuthorizationService) {
    }

    getAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {badgeId, gateId} = matchedData(req, {locations: ['params']});
            const authorization: Authorization = await this.service.getAuthorization(badgeId, gateId);
            return res.status(StatusCodes.OK).json(authorization);
        } catch (err) {
            next(err);
        }
    };

    getAllAuthorizations = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const authorizations: Authorization[] = await this.service.getAllAuthorizations();
            return res.status(StatusCodes.OK).json(authorizations);
        } catch (err) {
            next(err);
        }
    };

    createAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, {locations: ['body']}) as AuthorizationCreationAttributes;
            const authorization: Authorization = await this.service.createAuthorization(data);
            return res.status(StatusCodes.CREATED).json({message: 'Authorization created', authorization});
        } catch (err) {
            next(err);
        }
    };

    deleteAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {badgeId, gateId} = matchedData(req, {locations: ['params']});
            await this.service.deleteAuthorization(badgeId, gateId);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
