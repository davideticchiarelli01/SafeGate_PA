import { TransitRepository } from '../repositories/transitRepository';
import { Transit, TransitAttributes, TransitCreationAttributes } from "../models/transit";
import { ErrorFactory } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';

export class TransitService {
    constructor(private repo: TransitRepository) {
    }

    getTransit(id: string): Promise<Transit | null> {
        return this.repo.findById(id);
    }

    getAllTransits(): Promise<Transit[]> {
        return this.repo.findAll();
    }

    //async createTransit(data: TransitCreationAttributes): Promise<Transit> {
    //    return this.repo.create(data);
    //}

    async updateTransit(id: string, data: Partial<TransitAttributes>): Promise<Transit> {
        const transit: Transit | null = await this.repo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        return this.repo.update(transit, data);
    }


    async deleteTransit(id: string): Promise<void> {
        const transit: Transit | null = await this.repo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        return this.repo.delete(transit);
    }
}
