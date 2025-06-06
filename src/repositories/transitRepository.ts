import {IRepository} from "./repository";
import {TransitDao} from "../dao/transitDao";
import {Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes} from "../models/transit";
import {Op, Transaction, WhereOptions} from "sequelize";

export class TransitRepository implements IRepository<Transit, TransitCreationAttributes, TransitUpdateAttributes> {

    constructor(private transitDao: TransitDao) {
    }

    findById(id: string): Promise<Transit | null> {
        return this.transitDao.get(id);
    }

    findByBadgeGateAndDate(badgeId: string, gateId?: string, startDate?: Date, endDate?: Date): Promise<Transit[]> {
        let filter: WhereOptions<TransitAttributes> = {badgeId: badgeId};
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

    findAll(): Promise<Transit[]> {
        return this.transitDao.getAll();
    }

    create(data: TransitCreationAttributes, options?: { transaction?: Transaction }): Promise<Transit> {
        return this.transitDao.create(data, options);
    }

    update(transit: Transit, data: TransitUpdateAttributes, options?: { transaction?: Transaction }): Promise<Transit> {
        return this.transitDao.update(transit, data, options);
    }

    delete(transit: Transit, options?: { transaction?: Transaction }): Promise<void> {
        return this.transitDao.delete(transit, options);
    }
}
