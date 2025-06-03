import {Gate, GateAttributes, GateCreationAttributes} from "../models/gate";
import {IDao} from "./dao";

export class GateDao implements IDao<Gate, GateCreationAttributes, Partial<GateAttributes>> {
    async get(id: string): Promise<Gate | null> {
        return Gate.findByPk(id);
    }

    async getAll(): Promise<Gate[]> {
        return Gate.findAll();
    }

    async getByName(name: string): Promise<Gate | null> {
        return Gate.findOne({where: {name}});
    }

    async create(data: GateCreationAttributes): Promise<Gate> {
        return Gate.create(data);
    }

    async update(id: string, data: Partial<GateAttributes>): Promise<Gate | null> {
        const gate: Gate | null = await Gate.findByPk(id);
        if (!gate) return null;
        return gate.update(data);
    }

    async delete(id: string): Promise<void> {
        const gate = await Gate.findByPk(id);
        if (gate) await gate.destroy();
    }
}