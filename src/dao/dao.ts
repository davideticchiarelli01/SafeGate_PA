import { Transaction } from "sequelize";

/**
 * Generic Data Access Object (DAO) interface.
 * Defines a standard set of methods for CRUD operations on a model.
 *
 * @template TModel - The model type.
 * @template TCreate - The type used to create a new instance of the model.
 * @template TUpdate - The type used to update an existing instance (defaults to Partial<TModel>).
 */
export interface IDao<TModel, TCreate, TUpdate = Partial<TModel>> {

    /**
     * Retrieves a single entity using one or more identifying keys.
     * @param {...string[]} ids - One or more identifiers (e.g., UUIDs) used to locate the entity.
     * @returns {Promise<TModel | null>} - The entity if found, otherwise `null`.
     */
    get(...ids: string[]): Promise<TModel | null>;

    /**
     * Retrieves all entities of the model.
     * @returns {Promise<TModel[]>} - An array of all entities.
     */
    getAll(): Promise<TModel[]>;

    /**
     * Creates a new entity in the database.
     * @param {TCreate} data - Data required to create the entity.
     * @param {{ transaction?: Transaction }} [options] - Optional Sequelize transaction.
     * @returns {Promise<TModel>} - The newly created entity.
     */
    create(data: TCreate, options?: { transaction?: Transaction }): Promise<TModel>;

    /**
     * Updates an existing entity in the database.
     * Optional method, depending on the implementation.
     * @param {TModel} entity - The entity to update.
     * @param {TUpdate} data - Fields to update.
     * @param {{ transaction?: Transaction }} [options] - Optional Sequelize transaction.
     * @returns {Promise<TModel>} - The updated entity.
     */
    update?(entity: TModel, data: TUpdate, options?: { transaction?: Transaction }): Promise<TModel>;

    /**
     * Deletes an entity from the database.
     * @param {TModel} entity - The entity to delete.
     * @param {{ transaction?: Transaction }} [options] - Optional Sequelize transaction.
     * @returns {Promise<void>} - Resolves when deletion is complete.
     */
    delete(entity: TModel, options?: { transaction?: Transaction }): Promise<void>;
}
