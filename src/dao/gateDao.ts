import {Gate, GateAttributes, GateCreationAttributes} from "../models/gate";
import {IDao} from "./dao";

export class GateDao implements IDao<Gate, GateCreationAttributes, Partial<GateAttributes>> {
    async get(id: string): Promise<Gate | null> {
        return await Gate.findByPk(id);
    }

    async getAll(): Promise<Gate[]> {
        return await Gate.findAll();
    }

    async getByName(name: string): Promise<Gate | null> {
        return await Gate.findOne({where: {name}});
    }

    async create(data: GateCreationAttributes): Promise<Gate> {
        return await Gate.create(data);
    }

    async update(gate: Gate, data: Partial<GateAttributes>): Promise<Gate> {
        return await gate.update(data);
    }

    async delete(gate: Gate): Promise<void> {
        return await gate.destroy();
    }
}