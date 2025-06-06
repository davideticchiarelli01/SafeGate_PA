export interface IDao<TModel, TCreate, TUpdate = Partial<TModel>> {

    get(...ids: string[]): Promise<TModel | null>;
    
    getAll(): Promise<TModel[]>;

    create(data: TCreate): Promise<TModel>;

    update?(entity: TModel, data: TUpdate): Promise<TModel>;

    delete(entity: TModel): Promise<void>;
}
