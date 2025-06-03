import {IDao} from "./dao";
import {Transit} from "../models/transit";
import {TransitStatus} from "../enum/transitStatus";
import {DPI} from "../enum/dpi";

export class TransitDao {

    constructor() {
    }

    async get(id: string): Promise<Transit | null> {
        return Transit.findByPk(id);
    }

    async getAll(): Promise<Transit[]> {
        return Transit.findAll();
    }

    async create(transit: Transit): Promise<Transit> {
        return Transit.create(transit);
    }

    async update(transit: Transit, status: TransitStatus, usedDPIs: DPI[], DPIviolation: boolean): Promise<Transit> {
        transit.status = status;
        transit.DPIviolation = DPIviolation;
        transit.usedDPIs = usedDPIs;
        await transit.save();
        return transit;
    }

    async delete(transit: Transit): Promise<void> {
        await transit.destroy();
    }
}

