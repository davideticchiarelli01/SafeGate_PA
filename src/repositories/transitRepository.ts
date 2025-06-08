import { IRepository } from "./repository";
import { TransitDao } from "../dao/transitDao";
import { Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes } from "../models/transit";
import { Op, Transaction, WhereOptions } from "sequelize";

/**
 * Repository class for managing `Transit` entities.
 * Provides methods to query, create, update, and delete transit records.
 * Implements the `IRepository` interface.
 */
export class TransitRepository implements IRepository<Transit, TransitCreationAttributes, TransitUpdateAttributes> {

    /**
     * Constructs an instance of `TransitRepository`.
     * @param {TransitDao} transitDao - The DAO used for direct database access for transits.
     */
    constructor(private transitDao: TransitDao) {
    }

    /**
     * Retrieves a specific `Transit` by its ID.
     * @param {string} id - The ID of the transit.
     * @returns {Promise<Transit | null>} The transit if found, otherwise null.
     */
    findById(id: string): Promise<Transit | null> {
        return this.transitDao.get(id);
    }

    /**
     * Retrieves all `Transit` records matching a specific badge,
     * optionally filtered by gate and/or date range.
     * @param {string} badgeId - The badge ID.
     * @param {string} [gateId] - Optional gate ID to filter.
     * @param {Date} [startDate] - Optional start date for filtering.
     * @param {Date} [endDate] - Optional end date for filtering.
     * @returns {Promise<Transit[]>} The list of matching transits.
     */
    findByBadgeGateAndDate(badgeId: string, gateId?: string, startDate?: Date, endDate?: Date): Promise<Transit[]> {
        let filter: WhereOptions<TransitAttributes> = { badgeId: badgeId };
        if (gateId) filter.gateId = gateId;

        if (startDate && endDate) {
            filter.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            filter.createdAt = {
                [Op.gte]: startDate
            };
        } else if (endDate) {
            filter.createdAt = {
                [Op.lte]: endDate
            };
        }

        return this.transitDao.getManyFiltered(filter);
    }

    /**
     * Retrieves all `Transit` records within an optional date range.
     * @param {Date} [start] - Optional start date.
     * @param {Date} [end] - Optional end date.
     * @returns {Promise<Transit[]>} The list of matching transits.
     */
    async findAllInRange(start?: Date, end?: Date): Promise<Transit[]> {
        const filter: WhereOptions<TransitAttributes> = {};
        if (start && end) {
            filter.createdAt = {
                [Op.between]: [start, end]
            };
        } else if (start) {
            filter.createdAt = {
                [Op.gte]: start
            };
        } else if (end) {
            filter.createdAt = {
                [Op.lte]: end
            };
        }

        return this.transitDao.getManyFiltered(filter);
    }

    /**
     * Retrieves all `Transit` records from the database.
     * @returns {Promise<Transit[]>} A list of all transit records.
     */
    findAll(): Promise<Transit[]> {
        return this.transitDao.getAll();
    }

    /**
     * Creates a new `Transit` record.
     * @param {TransitCreationAttributes} data - The data for the new transit.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction context.
     * @returns {Promise<Transit>} The created transit.
     */
    create(data: TransitCreationAttributes, options?: { transaction?: Transaction }): Promise<Transit> {
        return this.transitDao.create(data, options);
    }

    /**
     * Updates an existing `Transit` record.
     * @param {Transit} transit - The transit instance to update.
     * @param {TransitUpdateAttributes} data - The fields to update.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction context.
     * @returns {Promise<Transit>} The updated transit.
     */
    update(transit: Transit, data: TransitUpdateAttributes, options?: { transaction?: Transaction }): Promise<Transit> {
        return this.transitDao.update(transit, data, options);
    }

    /**
     * Deletes a `Transit` record from the database.
     * @param {Transit} transit - The transit instance to delete.
     * @param {{ transaction?: Transaction }} [options] - Optional transaction context.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    delete(transit: Transit, options?: { transaction?: Transaction }): Promise<void> {
        return this.transitDao.delete(transit, options);
    }
}
