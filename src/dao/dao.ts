export interface IDao<TModel, TCreate, TUpdate = Partial<TModel>> {
    get(id: string): Promise<TModel | null>;

    getAll(): Promise<TModel[]>;

    create(data: TCreate): Promise<TModel>;

    update(id: string, data: TUpdate): Promise<TModel | null>;

    delete(id: string): Promise<void>;
}
