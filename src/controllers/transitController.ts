import { Request, Response, NextFunction } from 'express';
import { TransitService } from '../services/transitService';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes } from "../models/transit";
import { ReportFormats } from "../enum/reportFormats";
import { ErrorFactory } from "../factories/errorFactory";
import { UserPayload } from "../utils/userPayload";
import { start } from 'repl';
import Logger from '../logger/logger';

export class TransitController {
    constructor(private service: TransitService) {
    }

    getTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: UserPayload | undefined = req.user;
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
    //     export interface TransitCreationAttributes {
    //     id?: string
    //     gateId: string
    //     badgeId: string
    //     status: TransitStatus
    //     usedDPIs: string[]
    //     DPIviolation: boolean
    //     createdAt?: Date
    // }
    createTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { gateId, badgeId, status, usedDPIs, DPIviolation } = req.body;

            const data: TransitCreationAttributes = {
                gateId,
                badgeId,
                status,
                usedDPIs,
                DPIviolation
            }

            const transit: Transit = await this.service.createTransit(data);
            return res.status(StatusCodes.CREATED).json({ message: 'Transit created', transit });
        } catch (err) {
            next(err);
        }
    };

    //     export interface TransitAttributes {
    //     id: string
    //     gateId: string
    //     badgeId: string
    //     status: TransitStatus
    //     usedDPIs: string[]
    //     DPIviolation: boolean
    //     createdAt?: Date
    // }
    updateTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: TransitUpdateAttributes = req.body;
            const transit: Transit | null = await this.service.updateTransit(req.params.id, data);
            return res.status(StatusCodes.OK).json(transit);
        } catch (err) {
            next(err);
        }
    };

    deleteTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            await this.service.deleteTransit(id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };

    getTransitStats = async (req: Request, res: Response, next: NextFunction) => {
        const { badgeId } = req.params;
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

    getGateReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { format = ReportFormats.JSON } = req.query;
            const queryParams = req.query;

            const startDate: Date | undefined = queryParams.startDate ? new Date(queryParams.startDate as string) : undefined;
            const endDate: Date | undefined = queryParams.endDate ? new Date(queryParams.endDate as string) : undefined;

            console.log('Query params:', req.query);
            console.log('Start date:', startDate, 'End date:', endDate, 'Format:', format);

            const result = await this.service.generateGateReport(format as ReportFormats, startDate, endDate);

            switch (format) {
                case 'pdf':
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename="gate-report.pdf"');
                    return res.send(result);
                case 'csv':
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename="gate-report.csv"');
                    return res.send(result);
                default:
                    return res.status(StatusCodes.OK).json(result);
            }
        } catch (err) {
            next(err);
        }
    };

    getBadgeReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { format = ReportFormats.JSON } = req.query;
            const queryParams = req.query;

            const user: UserPayload | undefined = req.user;
            const startDate: Date | undefined = queryParams.startDate ? new Date(queryParams.startDate as string) : undefined;
            const endDate: Date | undefined = queryParams.endDate ? new Date(queryParams.endDate as string) : undefined;

            const result = await this.service.generateBadgeReport(format as ReportFormats, startDate, endDate, user);

            switch (format) {
                case 'pdf':
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename="gate-report.pdf"');
                    return res.send(result);
                case 'csv':
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename="gate-report.csv"');
                    return res.send(result);
                default:
                    return res.status(StatusCodes.OK).json(result);
            }
        } catch (err) {
            next(err);
        }
    }


}
