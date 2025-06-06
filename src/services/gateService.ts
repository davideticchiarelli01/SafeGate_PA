import { GateRepository } from '../repositories/gateRepository';
import { DPI } from '../enum/dpi';
import { Gate, GateAttributes, GateCreationAttributes, GateUpdateAttributes } from '../models/gate';
import { ErrorFactory } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';
import { Authorization } from "../models/authorization";

export class GateService {
    constructor(private repo: GateRepository) {
    }

    async getGate(id: string): Promise<Gate> {
        const gate: Gate | null = await this.repo.findById(id);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        return gate;
    }

    getAllGates(): Promise<Gate[]> {
        return this.repo.findAll();
    }

    async createGate(data: GateCreationAttributes): Promise<Gate> {
        const gate: Gate | null = await this.repo.findByName(data.name);
        if (gate) throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'Gate name already in use');
        return this.repo.create(data);
    }

    async updateGate(id: string, data: GateUpdateAttributes): Promise<Gate> {
        const gate: Gate | null = await this.repo.findById(id);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        return this.repo.update(gate, data);
    }

    async deleteGate(id: string): Promise<void> {
        const gate: Gate | null = await this.repo.findById(id);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        return this.repo.delete(gate);
    }
}
