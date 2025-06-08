/**
 * AuthorizationController class.
 * Handles HTTP requests related to authorizations between badges and gates.
 * Supports creation, retrieval, and deletion of authorizations.
 */

import { NextFunction, Request, Response } from 'express';
import { AuthorizationService } from '../services/authorizationService';
import { StatusCodes } from 'http-status-codes';
import { Authorization, AuthorizationCreationAttributes } from "../models/authorization";
import { matchedData } from "express-validator";

/**
 * Controller for authorization-related operations.
 */
export class AuthorizationController {
    /**
     * Creates a new instance of AuthorizationController.
     * @param {AuthorizationService} service - The service responsible for authorization logic.
     */
    constructor(private service: AuthorizationService) {
    }

    /**
     * Retrieves a single authorization by badgeId and gateId.
     * Expects both fields from route parameters.
     *
     * @param {Request} req - Express request object containing `badgeId` and `gateId` in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { badgeId, gateId } = matchedData(req, { locations: ['params'] });
            const authorization: Authorization = await this.service.getAuthorization(badgeId, gateId);
            return res.status(StatusCodes.OK).json(authorization);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves all authorizations in the system.
     *
     * @param {Request} _req - Express request object (not used).
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
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
     * Creates a new authorization between a badge and a gate.
     * Expects validated body with `badgeId` and `gateId`.
     *
     * @param {Request} req - Express request containing authorization data in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    createAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, { locations: ['body'] }) as AuthorizationCreationAttributes;
            const authorization: Authorization = await this.service.createAuthorization(data);
            return res.status(StatusCodes.CREATED).json({ message: 'Authorization created', authorization });
        } catch (err) {
            next(err);
        }
    };

    /**
     * Deletes a specific authorization using badgeId and gateId.
     * Expects both fields in route parameters.
     *
     * @param {Request} req - Express request object with `badgeId` and `gateId` in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    deleteAuthorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { badgeId, gateId } = matchedData(req, { locations: ['params'] });
            await this.service.deleteAuthorization(badgeId, gateId);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
