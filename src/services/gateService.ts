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
        const exists: Gate | null = await this.repo.findByName(data.name);
        if (exists) {
            throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'Gate name already in use');
        }
        return this.repo.create(data);
    }

    updateGate(id: string, data: Partial<GateAttributes>): Promise<Gate | null> {
        return this.repo.update(id, data);
    }

    deleteGate(id: string): Promise<void> {
        return this.repo.delete(id);
    }
}
