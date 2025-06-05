import {Request, Response, NextFunction} from 'express';
import {GateService} from '../services/gateService';
import {Gate, GateAttributes, GateCreationAttributes} from "../models/gate";
import {StatusCodes} from 'http-status-codes';

export class GateController {
    constructor(private service: GateService) {
    }

    getGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const gate: Gate = await this.service.getGate(id);
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
            const {name, requiredDPIs} = req.body;
            const data: GateCreationAttributes = {name, requiredDPIs};

            const gate: Gate = await this.service.createGate(data);
            return res.status(StatusCodes.CREATED).json({message: 'Gate created', gate});
        } catch (err) {
            next(err);
        }
    };

    updateGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const {requiredDPIs} = req.body;
            const data: Partial<GateAttributes> = {requiredDPIs};

            const gate: Gate = await this.service.updateGate(id, data);
            return res.status(StatusCodes.OK).json(gate);
        } catch (err) {
            next(err);
        }
    };


    deleteGate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;

            await this.service.deleteGate(id);
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
