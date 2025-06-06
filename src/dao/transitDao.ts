import {IDao} from "./dao";
import {Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes} from "../models/transit";
import {WhereOptions} from "sequelize";
import {Badge, BadgeAttributes} from "../models/badge";

export class TransitDao implements IDao<Transit, TransitCreationAttributes, TransitUpdateAttributes> {

    async get(id: string): Promise<Transit | null> {
        return await Transit.findByPk(id);
    }

    async getAll(): Promise<Transit[]> {
        return await Transit.findAll();
    }

    async getManyFiltered(filter: WhereOptions<TransitAttributes>): Promise<Transit[]> {
        return await Transit.findAll({where: filter});
    }

    async create(transit: TransitCreationAttributes): Promise<Transit> {
        return await Transit.create(transit);
    }

    async update(transit: Transit, data: TransitUpdateAttributes): Promise<Transit> {
        return await transit.update(data);
    }

    async delete(transit: Transit): Promise<void> {
        await transit.destroy();
    }
}

