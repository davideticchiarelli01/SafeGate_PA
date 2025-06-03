import {Gate, GateAttributes, GateCreationAttributes} from '../models/gate';
import {GateDao} from '../dao/gateDao';
import {IRepository} from "./repository";

export class GateRepository implements IRepository<Gate, GateCreationAttributes, Partial<GateAttributes>> {
    constructor(private dao: GateDao) {
    }

    findById(id: string): Promise<Gate | null> {
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

    update(id: string, data: Partial<GateAttributes>): Promise<Gate | null> {
        return this.dao.update(id, data);
    }

    delete(id: string): Promise<void> {
        return this.dao.delete(id);
    }
}