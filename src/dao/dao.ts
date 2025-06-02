export interface IDao<T> {
    get(id: string): Promise<T | null>;

    getAll(): Promise<T[]>;

    create(entity: T): Promise<T>;

    update(entity: T, ...args: any[]): Promise<T>;

    delete(entity: T): Promise<void>;
}
