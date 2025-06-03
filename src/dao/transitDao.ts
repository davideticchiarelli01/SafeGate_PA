import { IDao } from "./dao";
import { Transit, TransitAttributes, TransitCreationAttributes } from "../models/transit";

export class TransitDao implements IDao<Transit, TransitCreationAttributes, Partial<TransitAttributes>> {

    async get(id: string): Promise<Transit | null> {
        return await Transit.findByPk(id);
    }

    async getAll(): Promise<Transit[]> {
        return await Transit.findAll();
    }

    async create(transit: TransitCreationAttributes): Promise<Transit> {
        return await Transit.create(transit);
    }

    async update(transit: Transit, data: Partial<TransitAttributes>): Promise<Transit> {
        return await transit.update(data);
    }

    async delete(transit: Transit): Promise<void> {
        await transit.destroy();
    }
}

