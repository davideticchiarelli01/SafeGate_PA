import {Badge, BadgeAttributes, BadgeCreationAttributes} from '../models/badge';
import {BadgeRepository} from '../repositories/badgeRepository';
import {BadgeStatus} from "../enum/badgeStatus";
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

    getSuspendedBadges(): Promise<Badge[]> {
        const status: string = BadgeStatus.Suspended;
        return this.repo.findManyFilteredByStatus(status);
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

    async reactivateBadges(ids: string[]): Promise<Badge[]> {
        if (ids.length === 0) return [];
        const filteredBadges: Badge[] = await this.repo.findManyFilteredById(ids);
        const suspended: Badge[] = filteredBadges.filter(b => b.status === BadgeStatus.Suspended);
        if (suspended.length === 0) return [];
        await this.repo.updateMany(suspended, {status: BadgeStatus.Active});
        return await this.repo.findManyFilteredById(ids);
    }

    async deleteBadge(id: string): Promise<void> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return this.repo.delete(badge);
    }
}
