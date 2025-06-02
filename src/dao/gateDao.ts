import {IDao} from "./dao";
import {Gate} from "../models/gate";
import {DPI} from "../utils/dpi";

export class GateDao implements IDao<Gate> {

    constructor() {
    }

    async get(id: string): Promise<Gate | null> {
        return Gate.findByPk(id);
    }

    async getAll(): Promise<Gate[]> {
        return Gate.findAll();
    }

    async create(gate: Gate): Promise<Gate> {
        return Gate.create(gate);
    }

    async update(gate: Gate, requiredDPIs: DPI[]): Promise<Gate> {
        gate.requiredDPIs = requiredDPIs;
        await gate.save();
        return gate;
    }

    async delete(badge: Gate): Promise<void> {
        await badge.destroy();
    }
}

