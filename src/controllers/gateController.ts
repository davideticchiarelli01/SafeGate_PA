import {Request, Response, NextFunction} from 'express';
import {GateService} from '../services/gateService';
import {StatusCodes} from 'http-status-codes';
import {Gate, GateCreationAttributes} from "../models/gate";

export class GateController {
    constructor(private service: GateService) {
    }

    getGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gate: Gate | null = await this.service.getGate(req.params.id);
            return res.status(StatusCodes.OK).json(gate);
        } catch (err) {
            next(err);
        }
    };

    getAllGates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gates: Gate [] = await this.service.getAllGates();
            return res.status(StatusCodes.OK).json(gates);
        } catch (err) {
            next(err);
        }
    };

    createGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: GateCreationAttributes = req.body;
            const gate: Gate = await this.service.createGate(data);
            return res.status(StatusCodes.CREATED).json({message: 'Gate created', gate});
        } catch (err) {
            next(err);
        }
    };

    updateGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const gate: Gate | null = await this.service.updateGate(req.params.id, data);
            return res.status(StatusCodes.OK).json(gate);
        } catch (err) {
            next(err);
        }
    };

    deleteGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteGate(req.params.id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
