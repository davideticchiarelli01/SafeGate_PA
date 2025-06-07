import {NextFunction, Request, Response} from 'express';
import {AuthorizationService} from '../services/authorizationService';
import {StatusCodes} from 'http-status-codes';
import {Authorization, AuthorizationCreationAttributes} from "../models/authorization";
import {matchedData} from "express-validator";

/**
 * Controller class for handling `Authorization` related operations.
 * Provides methods for CRUD operations on `Authorization` entities.
 */
export class AuthorizationController {
    /**
     * Constructs an instance of `AuthorizationController`.
     * @param {AuthorizationService} service - The service layer for `Authorization` operations.
     */
    constructor(private service: AuthorizationService) {
    }

    /**
     * Retrieves a specific `Authorization` record by `badgeId` and `gateId`.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    getAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {badgeId, gateId} = matchedData(req, {locations: ['params']}); // Extracts badgeId and gateId from request parameters
            const authorization: Authorization = await this.service.getAuthorization(badgeId, gateId);
            return res.status(StatusCodes.OK).json(authorization);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves all `Authorization` records.
     * @param {Request} _req - The Express request object (unused).
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    getAllAuthorizations = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const authorizations: Authorization[] = await this.service.getAllAuthorizations();
            return res.status(StatusCodes.OK).json(authorizations);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Creates a new `Authorization` record.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    createAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, {locations: ['body']}) as AuthorizationCreationAttributes; // Extracts validate data from the request body
            const authorization: Authorization = await this.service.createAuthorization(data);
            return res.status(StatusCodes.CREATED).json({message: 'Authorization created', authorization});
        } catch (err) {
            next(err);
        }
    };

    /**
     * Deletes a specific `Authorization` record by `badgeId` and `gateId`.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    deleteAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {badgeId, gateId} = matchedData(req, {locations: ['params']}); // Extracts badgeId and gateId from request parameters
            await this.service.deleteAuthorization(badgeId, gateId);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}