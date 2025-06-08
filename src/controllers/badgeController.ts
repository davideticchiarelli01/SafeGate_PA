/**
 * BadgeController class.
 * Handles HTTP requests related to badge management:
 * creation, retrieval, updating, reactivation, and deletion.
 * Delegates business logic to the BadgeService.
 */

import { NextFunction, Request, Response } from 'express';
import { BadgeService } from '../services/badgeService';
import { StatusCodes } from 'http-status-codes';
import { Badge, BadgeCreationAttributes } from "../models/badge";
import { matchedData } from "express-validator";

/**
 * Controller for badge-related operations.
 */
export class BadgeController {
    /**
     * Creates a new instance of BadgeController.
     * @param {BadgeService} service - The service handling badge business logic.
     */
    constructor(private service: BadgeService) {
    }

    /**
     * Retrieves a single badge by its ID.
     * Expects the `id` param to be validated and matched.
     *
     * @param {Request} req - Express request containing `id` in params.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    getBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] });
            const badge: Badge | null = await this.service.getBadge(id);
            return res.status(StatusCodes.OK).json(badge);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves all badges from the system.
     *
     * @param {Request} _req - Unused request object.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    getAllBadges = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const badges: Badge[] = await this.service.getAllBadges();
            return res.status(StatusCodes.OK).json(badges);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves all suspended badges.
     *
     * @param {Request} _req - Unused request object.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    getSuspendedBadges = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const badges: Badge[] = await this.service.getSuspendedBadges();
            return res.status(StatusCodes.OK).json(badges);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Creates a new badge.
     * Expects validated body data with a `userId` and optional fields.
     *
     * @param {Request} req - Express request containing badge data in the body.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    createBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, { locations: ['body'] }) as BadgeCreationAttributes;
            const badge: Badge = await this.service.createBadge(data);
            return res.status(StatusCodes.CREATED).json({ message: 'Badge created', badge });
        } catch (err) {
            next(err);
        }
    };

    /**
     * Updates a badge by its ID.
     * Expects validated `id` param and body data.
     *
     * @param {Request} req - Express request with `id` in params and update data in body.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    updateBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] });
            const data = matchedData(req, { locations: ['body'] }) as BadgeCreationAttributes;
            const badge: Badge = await this.service.updateBadge(id, data);
            return res.status(StatusCodes.OK).json(badge);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Reactivates a list of suspended badges by their IDs.
     * Expects a `badgeIds` array in the request body.
     *
     * @param {Request} req - Express request containing badgeIds array in body.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    reactivateBadges = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { badgeIds } = matchedData(req, { locations: ['body'] });
            const updatedBadges: Badge[] = await this.service.reactivateBadges(badgeIds);
            return res.status(StatusCodes.OK).json(updatedBadges);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Deletes a badge by its ID.
     * Expects the `id` param to be validated.
     *
     * @param {Request} req - Express request containing badge `id` in params.
     * @param {Response} res - Express response.
     * @param {NextFunction} next - Express next middleware.
     */
    deleteBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] });
            await this.service.deleteBadge(id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
