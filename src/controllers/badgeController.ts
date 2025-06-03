import {Request, Response, NextFunction} from 'express';
import {BadgeService} from '../services/badgeService';
import {StatusCodes} from 'http-status-codes';
import {Badge, BadgeAttributes, BadgeCreationAttributes} from "../models/badge";

export class BadgeController {
    constructor(private service: BadgeService) {
    }

    getBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const badge: Badge | null = await this.service.getBadge(req.params.id);
            return res.status(StatusCodes.OK).json(badge);
        } catch (err) {
            next(err);
        }
    };

    getAllBadges = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const badges: Badge [] = await this.service.getAllBadges();
            return res.status(StatusCodes.OK).json(badges);
        } catch (err) {
            next(err);
        }
    };

    createBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: BadgeCreationAttributes = req.body;
            const badge: Badge = await this.service.createBadge(data);
            return res.status(StatusCodes.CREATED).json({message: 'Badge created', badge});
        } catch (err) {
            next(err);
        }
    };

    updateBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: Partial<BadgeAttributes> = req.body;
            const badge: Badge | null = await this.service.updateBadge(req.params.id, data);
            return res.status(StatusCodes.OK).json(badge);
        } catch (err) {
            next(err);
        }
    };

    deleteBadge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteBadge(req.params.id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
