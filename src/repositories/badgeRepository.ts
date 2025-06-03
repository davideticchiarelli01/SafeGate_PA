import {Badge, BadgeAttributes, BadgeCreationAttributes} from '../models/badge';
import {BadgeDao} from '../dao/badgeDao';
import {IRepository} from "./repository";

export class BadgeRepository implements IRepository<Badge, BadgeCreationAttributes, Partial<BadgeAttributes>> {
    constructor(private dao: BadgeDao) {
    }

    findById(id: string): Promise<Badge | null> {
        return this.dao.get(id);
    }

    findByUserId(userId: string): Promise<Badge | null> {
        return this.dao.getByUserId(userId);
    }

    findAll(): Promise<Badge[]> {
        return this.dao.getAll();
    }

    create(data: BadgeCreationAttributes): Promise<Badge> {
        return this.dao.create(data);
    }

    update(badge: Badge, data: Partial<BadgeAttributes>): Promise<Badge> {
        return this.dao.update(badge, data);
    }

    delete(badge: Badge): Promise<void> {
        return this.dao.delete(badge);
    }
}