import { Request, Response, NextFunction } from 'express';
import { TransitService } from '../services/transitService';
import { StatusCodes } from 'http-status-codes';
import { Transit, TransitAttributes, TransitCreationAttributes } from "../models/transit";

export class TransitController {
    constructor(private service: TransitService) {
    }

    getTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transit: Transit | null = await this.service.getTransit(req.params.id);
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
            return res.status(StatusCodes.CREATED).json({ message: 'Transit created', transit });
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
}
