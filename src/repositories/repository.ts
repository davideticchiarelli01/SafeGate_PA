export interface IRepository<TModel, TCreate, TUpdate = Partial<TModel>> {
    findById(id: string): Promise<TModel | null>;

    findAll(): Promise<TModel[]>;

    create(data: TCreate): Promise<TModel>;

    update(id: string, data: TUpdate): Promise<TModel | null>;

    delete(id: string): Promise<void>;
}
