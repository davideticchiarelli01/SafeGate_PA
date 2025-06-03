import {NextFunction, Request, Response} from 'express';
import {GateService} from "../services/gateService";
import {StatusCodes} from "http-status-codes";
import {Gate} from "../models/gate";

export class GateController {
    constructor(private gateService: GateService) {
    }

    getGate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const gateId: string = req.params.id;
            const gate: Gate | null = await this.gateService.getGate(gateId);
            return res.status(StatusCodes.OK).json(gate);
        } catch (error) {
            next(error);
        }
    }

    getAllGates = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const gates: Gate[] = await this.gateService.getAllGates();
            return res.status(StatusCodes.OK).json(gates);
        } catch (error) {
            next(error);
        }
    }

    createGate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        // creation logic
    }

    updateGate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        // update logic
    }

    deletePassage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        // deletion logic
    }


}
