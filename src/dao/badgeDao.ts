import {IDao} from "./dao";
import {Badge} from "../models/badge";
import {BadgeStatus} from "../utils/badgeStatus";

export class BadgeDao implements IDao<Badge> {

    constructor() {
    }

    async get(id: string): Promise<Badge | null> {
        return Badge.findByPk(id);
    }

    async getAll(): Promise<Badge[]> {
        return Badge.findAll();
    }

    async create(badge: Badge): Promise<Badge> {
        return Badge.create(badge);
    }

    async update(badge: Badge, status: BadgeStatus): Promise<Badge> {
        badge.status = status;
        await badge.save();
        return badge;
    }

    async delete(badge: Badge): Promise<void> {
        await badge.destroy();
    }
}

