import {Badge, BadgeAttributes, BadgeCreationAttributes, BadgeUpdateAttributes} from "../models/badge";
import {IDao} from "./dao";
import {WhereOptions} from "sequelize";

export class BadgeDao implements IDao<Badge, BadgeCreationAttributes, BadgeUpdateAttributes> {
    async get(id: string): Promise<Badge | null> {
        return await Badge.findByPk(id);
    }

    async getByUserId(userId: string): Promise<Badge | null> {
        return await Badge.findOne({where: {userId}});
    }

    async getManyFiltered(filter: WhereOptions<BadgeAttributes>): Promise<Badge[]> {
        return await Badge.findAll({where: filter});
    }

    async getAll(): Promise<Badge[]> {
        return await Badge.findAll();
    }

    async create(data: BadgeCreationAttributes): Promise<Badge> {
        return await Badge.create(data);
    }

    async update(badge: Badge, data: BadgeUpdateAttributes): Promise<Badge> {
        return await badge.update(data);
    }

    async updateMany(badges: Badge[], data: BadgeUpdateAttributes): Promise<Badge[]> {
        const ids = badges.map(b => b.id);
        await Badge.update(data, {where: {id: ids}});
        return await Badge.findAll({where: {id: ids}}); // this solution works with all DB
    }

    async delete(badge: Badge): Promise<void> {
        return await badge.destroy();
    }
}