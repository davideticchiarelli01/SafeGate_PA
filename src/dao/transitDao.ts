import {IDao} from "./dao";
import {Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes} from "../models/transit";
import {Transaction, WhereOptions} from "sequelize";

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

    async create(
        transit: TransitCreationAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Transit> {
        return await Transit.create(transit, {
            transaction: options?.transaction
        });
    }

    async update(
        transit: Transit,
        data: TransitUpdateAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Transit> {
        return await transit.update(data, {
            transaction: options?.transaction
        });
    }

    async delete(
        transit: Transit,
        options?: { transaction?: Transaction }
    ): Promise<void> {
        await transit.destroy({
            transaction: options?.transaction
        });
    }
}

