/**
 * TransitController class.
 * Handles HTTP requests related to transit records including:
 * creation, retrieval, update, deletion, and report generation.
 * Delegates business logic to the TransitService.
 */

import {NextFunction, Request, Response} from 'express';
import {TransitService} from '../services/transitService';
import {StatusCodes} from 'http-status-codes';
import {Transit, TransitCreationAttributes, TransitUpdateAttributes} from "../models/transit";
import {ReportFormats} from "../enum/reportFormats";
import {UserPayload} from "../utils/userPayload";
import {matchedData} from "express-validator";
import {normalizeDate} from '../utils/date';
import {setDownloadHeaders} from "../utils/downloadReport";

/**
 * Controller for transit-related operations.
 */
export class TransitController {
    /**
     * Creates a new instance of TransitController.
     * @param {TransitService} service - The service responsible for transit logic.
     */
    constructor(private service: TransitService) {
    }

    /**
     * Retrieves a single transit by its ID.
     * Expects the `id` param.
     *
     * @param {Request} req - Express request object containing `id` in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: UserPayload | undefined = req.user;
            const {id} = matchedData(req, {locations: ['params']});

            const transit: Transit | null = await this.service.getTransit(id, user);
            return res.status(StatusCodes.OK).json(transit);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves all transits.
     *
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getAllTransits = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transits: Transit[] = await this.service.getAllTransits();
            return res.status(StatusCodes.OK).json(transits);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Creates a new transit.
     * Expects validated body fields.
     *
     * @param {Request} req - Express request containing creation data in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    createTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, {locations: ['body']}) as TransitCreationAttributes;
            const transit: Transit = await this.service.createTransit(data);
            return res.status(StatusCodes.CREATED).json({message: 'Transit created', transit});
        } catch (err) {
            next(err);
        }
    };

    /**
     * Updates an existing transit.
     * Expects the `id` param and validated update fields.
     *
     * @param {Request} req - Express request with `id` in params and update data in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    updateTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, {locations: ['body']}) as TransitUpdateAttributes;
            const transit: Transit | null = await this.service.updateTransit(req.params.id, data);
            return res.status(StatusCodes.OK).json(transit);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Deletes a transit by ID.
     * Expects validated `id` param.
     *
     * @param {Request} req - Express request containing `id` in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    deleteTransit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = matchedData(req, {locations: ['params']});
            await this.service.deleteTransit(id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves statistics for a badge's transits.
     * Supports optional filtering by gate and date range.
     *
     * @param {Request} req - Express request with badgeId in params and filters in query.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getTransitStats = async (req: Request, res: Response, next: NextFunction) => {
        const {badgeId} = matchedData(req, {locations: ['params']});
        const query = matchedData(req, {locations: ['query']});

        try {
            const gateId: string | undefined = typeof query.gateId === 'string' ? query.gateId : undefined;
            const startDate: Date | undefined = normalizeDate(req.query.startDate as string);
            const endDate: Date | undefined = normalizeDate(req.query.endDate as string, true);

            const stats: object = await this.service.getTransitStats(badgeId, gateId, startDate, endDate);
            return res.status(StatusCodes.OK).json(stats);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Generates a report of gate transits in the specified format.
     * Supports `json`, `csv`, or `pdf` formats and filtering by date.
     *
     * @param {Request} req - Express request with optional format and date filters in query.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getGateReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {format = ReportFormats.JSON} = req.query;
            const startDate: Date | undefined = normalizeDate(req.query.startDate as string);
            const endDate: Date | undefined = normalizeDate(req.query.endDate as string, true);

            const result = await this.service.generateGateReport(format as ReportFormats, startDate, endDate);
            setDownloadHeaders(res, format as ReportFormats, 'gate-report');

            return res.send(result);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Generates a report of badge transits in the specified format.
     * Report is user-specific and supports filters by date.
     *
     * @param {Request} req - Express request with user in context and filters in query.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getBadgeReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {format = ReportFormats.JSON} = req.query;
            const user: UserPayload | undefined = req.user;
            const startDate: Date | undefined = normalizeDate(req.query.startDate as string);
            const endDate: Date | undefined = normalizeDate(req.query.endDate as string, true);

            const result = await this.service.generateBadgeReport(format as ReportFormats, startDate, endDate, user);
            setDownloadHeaders(res, format as ReportFormats, 'badge-report');

            return res.send(result);
        } catch (err) {
            next(err);
        }
    }
}
