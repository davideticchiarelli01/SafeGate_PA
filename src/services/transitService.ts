import {TransitRepository} from '../repositories/transitRepository';
import {BadgeRepository} from '../repositories/badgeRepository';
import {Transit, TransitAttributes, TransitCreationAttributes} from "../models/transit";
import {ErrorFactory} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';
import {UserPayload} from '../utils/userPayload';
import {UserRole} from '../enum/userRoles';
import {Badge} from "../models/badge";
import {TransitStatus} from "../enum/transitStatus";
import {GateRepository} from "../repositories/gateRepository";
import {Gate} from "../models/gate";
import {GateTransitsReport} from '../enum/reportTypes';
import {ReportFactory} from '../factories/reportFactory';
import {ReportFormats} from '../enum/reportFormats';

export class TransitService {
    constructor(
        private repo: TransitRepository,
        private badgeRepo: BadgeRepository,
        private gateRepo: GateRepository
    ) {
    }

    async getTransit(id: string, user?: UserPayload): Promise<Transit | null> {

        if (!user) throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'User not authenticated');

        const transit: Transit | null = await this.repo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');

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

    async getTransitStats(badgeId: string, gateId?: string, startDate?: Date, endDate?: Date): Promise<object> {

        if (!badgeId) throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Badge ID is required');
        const badge: Badge | null = await this.badgeRepo.findById(badgeId);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        if (gateId) {
            const gate: Gate | null = await this.gateRepo.findById(gateId);
            if (!gate) {
                throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
            }
        }

        if (startDate && endDate && startDate > endDate) {
            throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date cannot be after end date');
        }

        const transits: Transit[] = await this.repo.findByBadgeGateAndDate(badgeId, gateId, startDate, endDate);

        const statsMap: Record<string, {
            authorizedAccess: number;
            unauthorizedAccess: number;
            dpiViolation: number;
        }> = {};

        let totalAccess: number = 0;
        let totalDpiViolation: number = 0;

        for (const t of transits) {
            const gateId: string = t.gateId;
            if (!statsMap[gateId]) {
                statsMap[gateId] = {
                    authorizedAccess: 0,
                    unauthorizedAccess: 0,
                    dpiViolation: 0
                };
            }

            totalAccess++;

            if (t.DPIviolation) {
                totalDpiViolation++;
                statsMap[gateId].dpiViolation++;
            }

            if (t.status === TransitStatus.Authorized) statsMap[gateId].authorizedAccess++;
            else if (t.status === TransitStatus.Unauthorized) statsMap[gateId].unauthorizedAccess++;
            else console.warn(`Unknown transit status: ${t.status} for transit ID: ${t.id}`);

        }

        const gateStats = Object.entries(statsMap).map(([gateId, stats]) => ({
            gateId,
            authorizedAccess: stats.authorizedAccess,
            unauthorizedAccess: stats.unauthorizedAccess,
            dpiViolation: stats.dpiViolation
        }));

        return {
            badgeId,
            totalAccess,
            totalDpiViolation,
            gateStats
        };
    }

    async generateGateReport(
        start_date: string,
        end_date: string,
        format: ReportFormats
    ): Promise<Buffer | string | object> {

        const startDate = new Date(start_date as string);
        const endDate = new Date(end_date as string);

        const transits = await this.repo.findAllInRange(startDate, endDate);

        const grouped: Record<string, GateTransitsReport> = {};

        for (const t of transits) {
            const gateId = t.gateId;
            if (!grouped[gateId]) {
                grouped[gateId] = {
                    gateId,
                    authorized: 0,
                    unauthorized: 0,
                    dpiViolations: 0
                };
            }

            if (t.status == TransitStatus.Authorized) grouped[gateId].authorized++;
            else grouped[gateId].unauthorized++;

            if (t.DPIviolation) grouped[gateId].dpiViolations++;
        }

        const reportData = Object.values(grouped);
        return await ReportFactory.format(format, reportData);
    }
}
