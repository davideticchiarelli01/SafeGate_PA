import { Badge, BadgeAttributes, BadgeCreationAttributes, BadgeUpdateAttributes } from "../models/badge";
import { IDao } from "./dao";
import { Transaction, WhereOptions } from "sequelize";

/**
 * Data Access Object (DAO) for the `Badge` model.
 * Provides methods to interact with the database for `Badge` entities.
 * Implements the `IDao` interface for consistency across DAOs.
 */
export class BadgeDao implements IDao<Badge, BadgeCreationAttributes, BadgeUpdateAttributes> {

    /**
     * Retrieves a single `Badge` record by its ID.
     * @param {string} id - UUID of the badge.
     * @returns {Promise<Badge | null>} - The `Badge` record if found, otherwise `null`.
     */
    async get(id: string): Promise<Badge | null> {
        return await Badge.findByPk(id);
    }

    /**
     * Retrieves a single `Badge` record associated with a specific user ID.
     * @param {string} userId - UUID of the user.
     * @returns {Promise<Badge | null>} - The `Badge` record if found, otherwise `null`.
     */
    async getByUserId(userId: string): Promise<Badge | null> {
        return await Badge.findOne({ where: { userId } });
    }

    /**
     * Retrieves multiple `Badge` records based on a filtering condition.
     * @param {WhereOptions<BadgeAttributes>} filter - The filtering condition to apply.
     * @returns {Promise<Badge[]>} - An array of matching `Badge` records.
     */
    async getManyFiltered(filter: WhereOptions<BadgeAttributes>): Promise<Badge[]> {
        return await Badge.findAll({ where: filter });
    }

    /**
     * Retrieves all `Badge` records from the database.
     * @returns {Promise<Badge[]>} - An array of all `Badge` records.
     */
    async getAll(): Promise<Badge[]> {
        return await Badge.findAll();
    }

    /**
     * Creates a new `Badge` record in the database.
     * @param {BadgeCreationAttributes} data - The data required to create a new `Badge` record.
     * @returns {Promise<Badge>} - The newly created `Badge` record.
     */
    async create(data: BadgeCreationAttributes): Promise<Badge> {
        return await Badge.create(data);
    }

    /**
     * Updates an existing `Badge` record in the database.
     * @param {Badge} badge - The `Badge` instance to update.
     * @param {BadgeUpdateAttributes} data - The data to update on the badge.
     * @param {{ transaction?: Transaction }} [options] - Optional Sequelize transaction object.
     * @returns {Promise<Badge>} - The updated `Badge` record.
     */
    async update(
        badge: Badge,
        data: BadgeUpdateAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Badge> {
        return await badge.update(data, { transaction: options?.transaction });
    }

    /**
     * Updates multiple `Badge` records in bulk.
     * @param {Badge[]} badges - Array of `Badge` instances to update.
     * @param {BadgeUpdateAttributes} data - Data to apply to all badges.
     * @returns {Promise<Badge[]>} - An array of updated `Badge` records.
     */
    async updateMany(badges: Badge[], data: BadgeUpdateAttributes): Promise<Badge[]> {
        const ids = badges.map(b => b.id);
        await Badge.update(data, { where: { id: ids } });
        return await Badge.findAll({ where: { id: ids } }); // this solution works with all DB
    }

    /**
     * Deletes an existing `Badge` record from the database.
     * @param {Badge} badge - The `Badge` record to delete.
     * @returns {Promise<void>} - Resolves when the record is successfully deleted.
     */
    async delete(badge: Badge): Promise<void> {
        return await badge.destroy();
    }
}