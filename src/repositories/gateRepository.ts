import {IRepository} from "./repository";
import {GateDao} from "../dao/gateDao";
import {Gate} from "../models/gate";
import {DPI} from "../enum/dpi";

export class GateRepository implements IRepository<Gate> {
    constructor(private gateDao: GateDao) {
    }

    async findById(id: string): Promise<Gate | null> {
        return this.gateDao.get(id);
    }

    async findAll(): Promise<Gate[]> {
        return this.gateDao.getAll();
    }

    async create(data: { name: string, requiredDPIs: DPI[] }): Promise<Gate> {
        const gate: Gate = Gate.build(data);
        return gate.save();
    }

    update(id: string, item: Gate): Promise<Gate | null> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        const gate = await this.gateDao.get(id);

        if (!gate) {
            return;
        }

        await this.gateDao.delete(gate);

    }
}
