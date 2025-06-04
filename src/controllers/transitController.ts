import {Request, Response, NextFunction} from 'express';
import {TransitService} from '../services/transitService';
import {StatusCodes} from 'http-status-codes';
import {Transit, TransitAttributes, TransitCreationAttributes} from "../models/transit";

export class TransitController {
    constructor(private service: TransitService) {
    }

    getTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({message: "User not authenticated"});
            }
            const user = req.user;
            const transitId: string = req.params.id;
            const transit: Transit | null = await this.service.getTransit(transitId, user);
            return res.status(StatusCodes.OK).json(transit);
        } catch (err) {
            next(err);
        }
    };

    getAllTransits = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transits: Transit[] = await this.service.getAllTransits();
            return res.status(StatusCodes.OK).json(transits);
        } catch (err) {
            next(err);
        }
    };

    createTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: TransitCreationAttributes = req.body;
            const transit: Transit = await this.service.createTransit(data);
            return res.status(StatusCodes.CREATED).json({message: 'Transit created', transit});
        } catch (err) {
            next(err);
        }
    };

    updateTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: Partial<TransitAttributes> = req.body;
            const transit: Transit | null = await this.service.updateTransit(req.params.id, data);
            return res.status(StatusCodes.OK).json(transit);
        } catch (err) {
            next(err);
        }
    };

    deleteTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteTransit(req.params.id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };

    getTransitStats = async (req: Request, res: Response, next: NextFunction) => {
        const {badgeId} = req.params;
        const query = req.query;

        try {
            const gateId: string | undefined = typeof query.gateId === 'string' ? query.gateId : undefined;
            const start: Date | undefined = query.startDate ? new Date(query.startDate as string) : undefined;
            const end: Date | undefined = query.endDate ? new Date(query.endDate as string) : undefined;

            const stats: object = await this.service.getTransitStats(badgeId, gateId, start, end);
            return res.status(StatusCodes.OK).json(stats);
        } catch (err) {
            next(err);
        }
    }


}
