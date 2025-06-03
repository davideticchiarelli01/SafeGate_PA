import {IDao} from './dao';
import {Badge, BadgeAttributes, BadgeCreationAttributes} from '../models/badge';
import {Op} from 'sequelize';

export class BadgeDao {

    async get(id: string): Promise<Badge | null> {
        return Badge.findByPk(id);
    }

    async getAll(): Promise<Badge[]> {
        return Badge.findAll();
    }

    async create(data: BadgeCreationAttributes): Promise<Badge> {
        return Badge.create(data);
    }

    async update(id: string, data: Partial<BadgeAttributes>): Promise<Badge | null> {
        const badge: Badge | null = await Badge.findByPk(id);
        if (!badge) return null;
        return badge.update(data);
    }

    async delete(id: string): Promise<void> {
        const badge = await Badge.findByPk(id);
        if (badge) await badge.destroy();
    }
}
