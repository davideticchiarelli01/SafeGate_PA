import { Badge, BadgeAttributes, BadgeCreationAttributes, BadgeUpdateAttributes } from '../models/badge';
import { BadgeRepository } from '../repositories/badgeRepository';
import { BadgeStatus } from "../enum/badgeStatus";
import { ErrorFactory } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';
import { User } from "../models/user";
import { UserRepository } from "../repositories/userRepository";
import { UserRole } from '../enum/userRoles';

/**
 * Service class for handling `Badge` related operations.
 * Provides methods for creating, retrieving, updating, deleting, and reactivating badges.
 */
export class BadgeService {
    /**
     * Constructs an instance of `BadgeService`.
     * @param {BadgeRepository} repo - The repository layer for `Badge` operations.
     * @param {UserRepository} userRepo - The repository layer for `User` operations.
     */
    constructor(private repo: BadgeRepository, private userRepo: UserRepository) {
    }

    /**
     * Retrieves a specific `Badge` by its ID.
     * @param {string} id - The unique identifier of the badge.
     * @returns {Promise<Badge>} The badge if found.
     * @throws {HttpError} If the badge is not found.
     */
    async getBadge(id: string): Promise<Badge> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return badge;
    }

    /**
     * Retrieves all badges from the data source.
     * @returns {Promise<Badge[]>} A list of all badges.
     */
    getAllBadges(): Promise<Badge[]> {
        return this.repo.findAll();
    }

    /**
     * Retrieves all badges that are currently suspended.
     * @returns {Promise<Badge[]>} A list of suspended badges.
     */
    getSuspendedBadges(): Promise<Badge[]> {
        const status: BadgeStatus = BadgeStatus.Suspended;
        return this.repo.findManyFilteredByStatus(status);
    }

    /**
     * Creates a new badge for a user.
     * Ensures that the user exists, has an eligible role, and does not already have a badge.
     * @param {BadgeCreationAttributes} data - The attributes for creating the badge.
     * @returns {Promise<Badge>} The created badge.
     * @throws {HttpError} If the user is not found, is a gate, or already has a badge.
     */
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

    /**
     * Updates an existing badge.
     * Handles logic for resetting unauthorized attempts when reactivating a badge.
     * @param {string} id - The ID of the badge to update.
     * @param {BadgeUpdateAttributes} data - The fields to update.
     * @returns {Promise<Badge>} The updated badge.
     * @throws {HttpError} If the badge is not found.
     */
    async updateBadge(id: string, data: BadgeUpdateAttributes): Promise<Badge> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        // If the badge is being reactivated, reset attempts and timestamp
        if (data.status === BadgeStatus.Active) {
            data.unauthorizedAttempts = 0;
            data.firstUnauthorizedAttempt = null;
        } else if (data.unauthorizedAttempts === 0) {
            // If explicitly reset to 0 in other contexts, also reset the timestamp
            data.firstUnauthorizedAttempt = null;
        }

        return this.repo.update(badge, data);
    }

    /**
     * Reactivates multiple suspended badges by ID.
     * Resets unauthorized attempts and timestamp upon reactivation.
     * @param {string[]} ids - A list of badge IDs to reactivate.
     * @returns {Promise<Badge[]>} The list of reactivated badges.
     * @throws {HttpError} If the provided ID list is empty.
     */
    async reactivateBadges(ids: string[]) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'The list of badge IDs cannot be empty');
        }

        const foundBadges = await this.repo.findManyFilteredById(ids);
        const badgeMappedSet = new Set(foundBadges.map(b => b.id));
        const notFoundBadges = ids.filter(id => !badgeMappedSet.has(id));
        const suspended = foundBadges.filter(b => b.status === BadgeStatus.Suspended);

        if (suspended.length === 0) {
            return {
                updatedBadges: [],
                notFoundBadges
            };
        }

        const data: Partial<BadgeAttributes> = {
            status: BadgeStatus.Active,
            unauthorizedAttempts: 0,
            firstUnauthorizedAttempt: null
        };

        const updatedBadges = await this.repo.updateMany(suspended, data);

        return {
            updatedBadges,
            notFoundBadges
        };
    }

    /**
     * Deletes a badge by its ID.
     * @param {string} id - The ID of the badge to delete.
     * @returns {Promise<void>} Resolves when the badge is deleted.
     * @throws {HttpError} If the badge is not found.
     */
    async deleteBadge(id: string): Promise<void> {
        const badge: Badge | null = await this.repo.findById(id);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');
        return this.repo.delete(badge);
    }
}
