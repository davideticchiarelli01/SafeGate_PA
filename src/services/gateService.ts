import {GateRepository} from '../repositories/gateRepository';
import {DPI} from '../enum/dpi';
import {Gate, GateAttributes, GateCreationAttributes} from '../models/gate';
import {ErrorFactory} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';

export class GateService {
    constructor(private repo: GateRepository) {
    }

    getGate(id: string): Promise<Gate | null> {
        return this.repo.findById(id);
    }

    getAllGates(): Promise<Gate[]> {
        return this.repo.findAll();
    }

    async createGate(data: GateCreationAttributes): Promise<Gate> {
        const gate: Gate | null = await this.repo.findByName(data.name);
        if (gate) {
            throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'Gate name already in use');
        }
        return this.repo.create(data);
    }

    async updateGate(id: string, data: Partial<GateAttributes>): Promise<Gate> {
        const gate = await this.repo.findById(id);
        if (!gate) {
            throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        }
        return this.repo.update(gate, data);
    }


    async deleteGate(id: string): Promise<void> {
        const gate = await this.repo.findById(id);
        if (!gate) {
            throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        }
        return this.repo.delete(gate);
    }
}
