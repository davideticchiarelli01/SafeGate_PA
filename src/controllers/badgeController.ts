import {NextFunction, Request, Response} from 'express';
import {BadgeService} from '../services/badgeService';
import {StatusCodes} from 'http-status-codes';
import {Badge, BadgeCreationAttributes} from "../models/badge";
import {matchedData} from "express-validator";

export class BadgeController {
    constructor(private service: BadgeService) {
    }

    getBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = matchedData(req, {locations: ['params']});

            const badge: Badge | null = await this.service.getBadge(id);
            return res.status(StatusCodes.OK).json(badge);
        } catch (err) {
            next(err);
        }
    };

    getAllBadges = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const badges: Badge[] = await this.service.getAllBadges();
            return res.status(StatusCodes.OK).json(badges);
        } catch (err) {
            next(err);
        }
    };

    getSuspendedBadges = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const badges: Badge[] = await this.service.getSuspendedBadges();
            return res.status(StatusCodes.OK).json(badges);
        } catch (err) {
            next(err);
        }
    }

    createBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, {locations: ['body']}) as BadgeCreationAttributes;

            const badge: Badge = await this.service.createBadge(data);
            return res.status(StatusCodes.CREATED).json({message: 'Badge created', badge});
        } catch (err) {
            next(err);
        }
    };

    updateBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = matchedData(req, {locations: ['params']});
            const data = matchedData(req, {locations: ['body']}) as BadgeCreationAttributes;

            const badge: Badge | null = await this.service.updateBadge(id, data);
            return res.status(StatusCodes.OK).json(badge);
        } catch (err) {
            next(err);
        }
    };

    reactivateBadges = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {badgeIds} = matchedData(req, {locations: ['body']});

            const updatedBadges: Badge[] = await this.service.reactivateBadges(badgeIds);
            return res.status(StatusCodes.OK).json(updatedBadges);
        } catch (err) {
            next(err);
        }
    };

    deleteBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = matchedData(req, {locations: ['params']});

            await this.service.deleteBadge(id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
