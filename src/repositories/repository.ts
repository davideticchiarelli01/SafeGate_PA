import {Transaction} from "sequelize";

export interface IRepository<TModel, TCreate, TUpdate = Partial<TModel>> {
    findById(...id: string[]): Promise<TModel | null>;

    findAll(): Promise<TModel[]>;

    create(data: TCreate, options?: { transaction?: Transaction }): Promise<TModel>;

    update?(instance: TModel, data: TUpdate, options?: { transaction?: Transaction }): Promise<TModel | null>;

    delete(instance: TModel, options?: { transaction?: Transaction }): Promise<void>;
}
