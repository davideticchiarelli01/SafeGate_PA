/**
 * GateController class.
 * Handles HTTP requests related to gate management:
 * creation, retrieval, updating, and deletion of gates.
 * Delegates business logic to the GateService.
 */

import { NextFunction, Request, Response } from 'express';
import { GateService } from '../services/gateService';
import { Gate, GateCreationAttributes, GateUpdateAttributes } from "../models/gate";
import { StatusCodes } from 'http-status-codes';
import { matchedData } from "express-validator";

/**
 * Controller for gate-related operations.
 */
export class GateController {
    /**
     * Creates a new instance of GateController.
     * @param {GateService} service - The service responsible for gate logic.
     */
    constructor(private service: GateService) {
    }

    /**
     * Retrieves a single gate by its ID.
     * Expects the `id` param.
     *
     * @param {Request} req - Express request object containing `id` in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] });
            const gate: Gate = await this.service.getGate(id);
            return res.status(StatusCodes.OK).json(gate);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Retrieves all gates in the system.
     *
     * @param {Request} req - Express request object (not used).
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    getAllGates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gates: Gate[] = await this.service.getAllGates();
            return res.status(StatusCodes.OK).json(gates);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Creates a new gate.
     * Expects validated body fields.
     *
     * @param {Request} req - Express request with gate creation data in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    createGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req, { locations: ['body'] }) as GateCreationAttributes;
            const gate: Gate = await this.service.createGate(data);
            return res.status(StatusCodes.CREATED).json({ message: 'Gate created', gate });
        } catch (err) {
            next(err);
        }
    };

    /**
     * Updates an existing gate.
     * Expects validated `id` in params and updated `requiredDPIs` in body.
     *
     * @param {Request} req - Express request with `id` in params and update data in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    updateGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] });
            const data = matchedData(req, { locations: ['body'] }) as GateUpdateAttributes;
            const gate: Gate = await this.service.updateGate(id, data);
            return res.status(StatusCodes.OK).json(gate);
        } catch (err) {
            next(err);
        }
    };

    /**
     * Deletes a gate by its ID.
     * Expects validated `id` param.
     *
     * @param {Request} req - Express request with gate `id` in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    deleteGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] });
            await this.service.deleteGate(id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
