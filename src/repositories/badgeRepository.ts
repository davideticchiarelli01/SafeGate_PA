import { Badge, BadgeCreationAttributes, BadgeUpdateAttributes } from '../models/badge';
import { BadgeDao } from '../dao/badgeDao';
import { IRepository } from "./repository";
import { Op, Transaction } from "sequelize";
import { BadgeStatus } from "../enum/badgeStatus";

/**
 * Repository class for managing `Badge` entities.
 * Acts as an intermediary between the `BadgeDao` and the service layer.
 * Implements the `IRepository` interface.
 */
export class BadgeRepository implements IRepository<Badge, BadgeCreationAttributes, BadgeUpdateAttributes> {

    /**
     * Constructs an instance of `BadgeRepository`.
     * @param {BadgeDao} dao - The DAO used for direct database access.
     */
    constructor(private dao: BadgeDao) {
    }

    /**
     * Retrieves a `Badge` by its unique ID.
     * @param {string} id - The ID of the badge.
     * @returns {Promise<Badge | null>} The badge if found, otherwise null.
     */
    findById(id: string): Promise<Badge | null> {
        return this.dao.get(id);
    }

    /**
     * Retrieves a `Badge` associated with a specific user ID.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Badge | null>} The badge if found, otherwise null.
     */
    findByUserId(userId: string): Promise<Badge | null> {
        return this.dao.getByUserId(userId);
    }

    /**
     * Retrieves multiple `Badge` records by their IDs.
     * @param {string[]} ids - Array of badge IDs to filter.
     * @returns {Promise<Badge[]>} A list of matching badges.
     */
    findManyFilteredById(ids: string[]): Promise<Badge[]> {
        const filter = {
            id: { [Op.in]: ids }
        };
        return this.dao.getManyFiltered(filter);
    }

    /**
     * Retrieves all badges with the specified status.
     * @param {BadgeStatus} status - The status to filter by.
     * @returns {Promise<Badge[]>} A list of matching badges.
     */
    findManyFilteredByStatus(status: BadgeStatus): Promise<Badge[]> {
        const filter = { status: status };
        return this.dao.getManyFiltered(filter);
    }

    /**
     * Retrieves badges by their IDs and a specific status.
     * @param {string[]} ids - Array of badge IDs.
     * @param {BadgeStatus} status - The status to filter by.
     * @returns {Promise<Badge[]>} A list of matching badges.
     */
    findManyByIdAndStatus(ids: string[], status: BadgeStatus): Promise<Badge[]> {
        const filter = {
            id: { [Op.in]: ids },
            status: status
        };
        return this.dao.getManyFiltered(filter);
    }

    /**
     * Retrieves all badges from the database.
     * @returns {Promise<Badge[]>} A list of all badges.
     */
    findAll(): Promise<Badge[]> {
        return this.dao.getAll();
    }

    /**
     * Creates a new `Badge`.
     * @param {BadgeCreationAttributes} data - The data for creating the badge.
     * @returns {Promise<Badge>} The created badge.
     */
    create(data: BadgeCreationAttributes): Promise<Badge> {
        return this.dao.create(data);
    }

    /**
     * Updates a `Badge` with new data.
     * Optionally supports a Sequelize transaction.
     * @param {Badge} badge - The badge instance to update.
     * @param {BadgeUpdateAttributes} data - The fields to update.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction object.
     * @returns {Promise<Badge>} The updated badge.
     */
    update(
        badge: Badge,
        data: BadgeUpdateAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Badge> {
        return this.dao.update(badge, data, options);
    }

    /**
     * Updates multiple `Badge` records at once.
     * @param {Badge[]} badges - Array of badge instances to update.
     * @param {BadgeUpdateAttributes} data - Fields to apply to all badges.
     * @returns {Promise<Badge[]>} The updated badges.
     */
    updateMany(badges: Badge[], data: BadgeUpdateAttributes): Promise<Badge[]> {
        return this.dao.updateMany(badges, data);
    }

    /**
     * Deletes a `Badge` from the database.
     * @param {Badge} badge - The badge instance to delete.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    delete(badge: Badge): Promise<void> {
        return this.dao.delete(badge);
    }
}
