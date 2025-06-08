import { IDao } from "./dao";
import { Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes } from "../models/transit";
import { Transaction, WhereOptions } from "sequelize";

/**
 * Data Access Object (DAO) for the `Transit` model.
 * Provides methods to interact with the database for `Transit` entities.
 * Implements the `IDao` interface for consistency across DAOs.
 */
export class TransitDao implements IDao<Transit, TransitCreationAttributes, TransitUpdateAttributes> {

    /**
     * Retrieves a `Transit` record by its primary key (ID).
     * @param {string} id - UUID of the transit to retrieve.
     * @returns {Promise<Transit | null>} - The `Transit` record if found, otherwise `null`.
     */
    async get(id: string): Promise<Transit | null> {
        return await Transit.findByPk(id);
    }

    /**
     * Retrieves all `Transit` records from the database.
     * @returns {Promise<Transit[]>} - An array of all `Transit` records.
     */
    async getAll(): Promise<Transit[]> {
        return await Transit.findAll();
    }

    /**
     * Retrieves multiple `Transit` records filtered by specific conditions.
     * @param {WhereOptions<TransitAttributes>} filter - Sequelize conditions for filtering.
     * @returns {Promise<Transit[]>} - An array of filtered `Transit` records.
     */
    async getManyFiltered(filter: WhereOptions<TransitAttributes>): Promise<Transit[]> {
        return await Transit.findAll({ where: filter });
    }

    /**
     * Creates a new `Transit` record in the database.
     * @param {TransitCreationAttributes} transit - The data for the new transit.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction object for atomic operations.
     * @returns {Promise<Transit>} - The newly created `Transit` record.
     */
    async create(
        transit: TransitCreationAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Transit> {
        return await Transit.create(transit, {
            transaction: options?.transaction
        });
    }

    /**
     * Updates an existing `Transit` record in the database.
     * @param {Transit} transit - The transit instance to update.
     * @param {TransitUpdateAttributes} data - The data to update on the transit.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction object for atomic operations.
     * @returns {Promise<Transit>} - The updated `Transit` record.
     */
    async update(
        transit: Transit,
        data: TransitUpdateAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Transit> {
        return await transit.update(data, {
            transaction: options?.transaction
        });
    }

    /**
     * Deletes a `Transit` record from the database.
     * @param {Transit} transit - The transit instance to delete.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction object for atomic operations.
     * @returns {Promise<void>} - Resolves when the record is successfully deleted.
     */
    async delete(
        transit: Transit,
        options?: { transaction?: Transaction }
    ): Promise<void> {
        await transit.destroy({
            transaction: options?.transaction
        });
    }
}