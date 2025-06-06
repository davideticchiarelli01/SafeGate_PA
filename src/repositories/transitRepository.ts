import {IRepository} from "./repository";
import {TransitDao} from "../dao/transitDao";
import {Transit, TransitAttributes, TransitCreationAttributes, TransitUpdateAttributes} from "../models/transit";
import {UserPayload} from "../utils/userPayload";
import {UserRole} from "../enum/userRoles";
import {User} from "../models/user";
import {Badge} from "../models/badge";
import {Op, WhereOptions} from "sequelize";

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

    create(data: TransitCreationAttributes): Promise<Transit> {
        return this.transitDao.create(data);
    }

    update(transit: Transit, data: TransitUpdateAttributes): Promise<Transit> {
        return this.transitDao.update(transit, data);
    }

    delete(transit: Transit): Promise<void> {
        return this.transitDao.delete(transit);
    }
}
