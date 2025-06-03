export interface IRepository<TModel, TCreate, TUpdate = Partial<TModel>> {
    findById(id: string): Promise<TModel | null>;

    findAll(): Promise<TModel[]>;

    create(data: TCreate): Promise<TModel>;

    update(instance: TModel, data: TUpdate): Promise<TModel>;

    delete(instance: TModel): Promise<void>;
}
