import { Gate, GateAttributes, GateCreationAttributes, GateUpdateAttributes } from '../models/gate';
import { GateDao } from '../dao/gateDao';
import { IRepository } from "./repository";

export class GateRepository implements IRepository<Gate, GateCreationAttributes, Partial<GateAttributes>> {
    constructor(private dao: GateDao) {
    }

    async findById(id: string): Promise<Gate | null> {
        return this.dao.get(id);
    }

    findAll(): Promise<Gate[]> {
        return this.dao.getAll();
    }

    findByName(name: string): Promise<Gate | null> {
        return this.dao.getByName(name);
    }

    create(data: GateCreationAttributes): Promise<Gate> {
        return this.dao.create(data);
    }

    update(gate: Gate, data: GateUpdateAttributes): Promise<Gate> {
        return this.dao.update(gate, data);
    }

    delete(gate: Gate): Promise<void> {
        return this.dao.delete(gate);
    }
}