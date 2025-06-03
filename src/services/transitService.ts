import { TransitRepository } from '../repositories/transitRepository';
import { BadgeRepository } from '../repositories/badgeRepository';
import { Transit, TransitAttributes, TransitCreationAttributes } from "../models/transit";
import { ErrorFactory } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';
import { UserPayload } from '../utils/userPayload';
import { UserRole } from '../enum/userRoles';

export class TransitService {
    constructor(
        private repo: TransitRepository,
        private badgeRepo: BadgeRepository
    ) { }

    async getTransit(id: string, user: UserPayload): Promise<Transit | null> {
        const transit: Transit | null = await this.repo.findById(id);

        if (!transit) {
            throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        }
        switch (user.role) {
            case UserRole.Admin:
                return transit;

            case UserRole.User:
                const badge = await this.badgeRepo.findById(transit.badgeId);
                if (badge && badge.userId === user.id) {
                    return transit;
                }
                throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found for this user');

            case UserRole.Gate:
            default:
                throw ErrorFactory.createError(
                    ReasonPhrases.UNAUTHORIZED,
                    'Permission denied: gate users cannot access this resource'
                );
        }
    }


    getAllTransits(): Promise<Transit[]> {
        return this.repo.findAll();
    }

    async createTransit(data: TransitCreationAttributes): Promise<Transit> {
        return this.repo.create(data);
    }

    async updateTransit(id: string, data: Partial<TransitAttributes>): Promise<Transit> {
        const transit: Transit | null = await this.repo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        return this.repo.update(transit, data);
    }


    async deleteTransit(id: string): Promise<void> {
        const transit: Transit | null = await this.repo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        return this.repo.delete(transit);
    }
}
