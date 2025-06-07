import { Badge, BadgeAttributes, BadgeCreationAttributes, BadgeUpdateAttributes } from '../models/badge';
import { BadgeRepository } from '../repositories/badgeRepository';
import { BadgeStatus } from "../enum/badgeStatus";
import { ErrorFactory } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';
import { User } from "../models/user";
import { UserRepository } from "../repositories/userRepository";
import { UserRole } from '../enum/userRoles';

export class BadgeService {
    constructor(private repo: BadgeRepository, private userRepo: UserRepository) {
    }

    async getBadge(id: string): Promise<Badge> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return badge;
    }

    getAllBadges(): Promise<Badge[]> {
        return this.repo.findAll();
    }

    getSuspendedBadges(): Promise<Badge[]> {
        const status: BadgeStatus = BadgeStatus.Suspended;
        return this.repo.findManyFilteredByStatus(status);
    }

    async createBadge(data: BadgeCreationAttributes): Promise<Badge> {
        const user: User | null = await this.userRepo.findById(data.userId);
        if (!user) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'User not found');
        if (user.role === UserRole.Gate) {
            throw ErrorFactory.createError(ReasonPhrases.FORBIDDEN, 'Users with role Gate cannot be assigned a badge');
        }

        const badge: Badge | null = await this.repo.findByUserId(data.userId);
        if (badge) throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'User already has a badge');

        return this.repo.create(data);
    }

    async updateBadge(id: string, data: BadgeUpdateAttributes): Promise<Badge> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        // If the unauthorized attempts are set to 0, reset the firstUnauthorizedAttempt to null
        if (data.unauthorizedAttempts === 0) {
            data.firstUnauthorizedAttempt = null;
        }

        return this.repo.update(badge, data);
    }

    async reactivateBadges(ids: string[]): Promise<Badge[]> {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'The list of badge IDs cannot be empty');
        }

        const suspended: Badge[] = await this.repo.findManyByIdAndStatus(ids, BadgeStatus.Suspended);
        if (suspended.length === 0) return [];

        const data: Partial<BadgeAttributes> = { status: BadgeStatus.Active };
        return await this.repo.updateMany(suspended, data);
    }


    async deleteBadge(id: string): Promise<void> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return this.repo.delete(badge);
    }
}
