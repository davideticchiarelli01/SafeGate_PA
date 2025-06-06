import {Badge, BadgeAttributes, BadgeCreationAttributes, BadgeUpdateAttributes} from '../models/badge';
import {BadgeDao} from '../dao/badgeDao';
import {IRepository} from "./repository";
import {Op, Transaction} from "sequelize";
import {BadgeStatus} from "../enum/badgeStatus";

export class BadgeRepository implements IRepository<Badge, BadgeCreationAttributes, BadgeUpdateAttributes> {
    constructor(private dao: BadgeDao) {
    }

    findById(id: string): Promise<Badge | null> {
        return this.dao.get(id);
    }

    findByUserId(userId: string): Promise<Badge | null> {
        return this.dao.getByUserId(userId);
    }

    findManyFilteredById(ids: string[]): Promise<Badge[]> {
        const filter = {
            id: {[Op.in]: ids}
        };
        return this.dao.getManyFiltered(filter);
    }

    findManyFilteredByStatus(status: BadgeStatus): Promise<Badge[]> {
        const filter = {status: status};
        return this.dao.getManyFiltered(filter);
    }

    findManyByIdAndStatus(ids: string[], status: BadgeStatus): Promise<Badge[]> {
        const filter = {
            id: {[Op.in]: ids},
            status: status
        };
        return this.dao.getManyFiltered(filter);
    }

    findAll(): Promise<Badge[]> {
        return this.dao.getAll();
    }

    create(data: BadgeCreationAttributes): Promise<Badge> {
        return this.dao.create(data);
    }

    update(
        badge: Badge,
        data: BadgeUpdateAttributes,
        options?: { transaction?: Transaction }
    ): Promise<Badge> {
        return this.dao.update(badge, data, options);
    }

    updateMany(badges: Badge[], data: BadgeUpdateAttributes): Promise<Badge[]> {
        return this.dao.updateMany(badges, data);
    }

    delete(badge: Badge): Promise<void> {
        return this.dao.delete(badge);
    }
}