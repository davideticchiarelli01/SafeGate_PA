import {Transaction} from "sequelize";

export interface IDao<TModel, TCreate, TUpdate = Partial<TModel>> {

    get(...ids: string[]): Promise<TModel | null>;

    getAll(): Promise<TModel[]>;

    create(data: TCreate, options?: { transaction?: Transaction }): Promise<TModel>;

    update?(entity: TModel, data: TUpdate, options?: { transaction?: Transaction }): Promise<TModel>;

    delete(entity: TModel, options?: { transaction?: Transaction }): Promise<void>;
}
