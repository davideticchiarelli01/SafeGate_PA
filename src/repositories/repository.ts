import { Transaction } from "sequelize";

/**
 * Generic interface for repository pattern.
 * Defines standard CRUD operations with optional transaction support.
 *
 * @template TModel - The type of the model entity.
 * @template TCreate - The type used for creating a new entity.
 * @template TUpdate - The type used for updating an existing entity (defaults to Partial<TModel>).
 */
export interface IRepository<TModel, TCreate, TUpdate = Partial<TModel>> {

    /**
     * Finds a single record by its identifier(s).
     * @param {...string[]} id - One or more identifier values (for composite keys or single ID).
     * @returns {Promise<TModel | null>} The found model or null if not found.
     */
    findById(...id: string[]): Promise<TModel | null>;

    /**
     * Retrieves all records of the model.
     * @returns {Promise<TModel[]>} A list of all records.
     */
    findAll(): Promise<TModel[]>;

    /**
     * Creates a new model instance.
     * @param {TCreate} data - The data used to create the entity.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction context.
     * @returns {Promise<TModel>} The newly created entity.
     */
    create(data: TCreate, options?: { transaction?: Transaction }): Promise<TModel>;

    /**
     * Updates an existing model instance.
     * Optional method depending on the repository.
     * @param {TModel} instance - The current model instance to update.
     * @param {TUpdate} data - The new data to apply.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction context.
     * @returns {Promise<TModel | null>} The updated model or null.
     */
    update?(
        instance: TModel,
        data: TUpdate,
        options?: { transaction?: Transaction }
    ): Promise<TModel | null>;

    /**
     * Deletes a model instance.
     * @param {TModel} instance - The model instance to delete.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction context.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    delete(instance: TModel, options?: { transaction?: Transaction }): Promise<void>;
}
