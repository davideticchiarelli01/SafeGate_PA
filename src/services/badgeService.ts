import {BadgeRepository} from '../repositories/badgeRepository';
import {Badge, BadgeAttributes, BadgeCreationAttributes} from '../models/badge';
import {ErrorFactory} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';

export class BadgeService {
    constructor(private repo: BadgeRepository) {
    }

    getBadge(id: string): Promise<Badge | null> {
        return this.repo.findById(id);
    }

    getAllBadges(): Promise<Badge[]> {
        return this.repo.findAll();
    }

    async createBadge(data: BadgeCreationAttributes): Promise<Badge> {
        const badge: Badge | null = await this.repo.findByUserId(data.userId);
        if (badge) throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'A Badge already exists for this user');
        return this.repo.create(data);
    }

    async updateBadge(id: string, data: Partial<BadgeAttributes>): Promise<Badge> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return this.repo.update(badge, data);
    }


    async deleteBadge(id: string): Promise<void> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return this.repo.delete(badge);
    }
}
