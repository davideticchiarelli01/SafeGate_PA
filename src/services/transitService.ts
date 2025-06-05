import { TransitRepository } from "../repositories/transitRepository";
import { BadgeRepository } from "../repositories/badgeRepository";
import { AuthorizationRepository } from "../repositories/authorizationRepository";
import { GateRepository } from "../repositories/gateRepository";
import { UserPayload } from "../utils/userPayload";
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Transit, TransitAttributes, TransitCreationAttributes } from "../models/transit";
import { UserRole } from "../enum/userRoles";
import { TransitStatus } from "../enum/transitStatus";
import { Gate } from "../models/gate";
import { Badge } from "../models/badge";
import { BadgeStatus } from "../enum/badgeStatus";
import { Authorization } from "../models/authorization";
import { ReportFactory } from "../factories/reportFactory";
import { ReportFormats } from "../enum/reportFormats";
import { BadgeTransitsReport, GateTransitsReport } from "../enum/reportTypes";


export class TransitService {
    constructor(
        private repo: TransitRepository,
        private badgeRepo: BadgeRepository,
        private gateRepo: GateRepository,
        private authRepo: AuthorizationRepository
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

        let authorized: TransitStatus = TransitStatus.Unauthorized;
        let dpiViolation: boolean = false;

        const gateId: string = data.gateId;
        const gate: Gate | null = await this.gateRepo.findById(gateId);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');

        const badgeId: string = data.badgeId;
        const badge: Badge | null = await this.badgeRepo.findById(badgeId);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        if (badge.status === BadgeStatus.Active) {
            const gateAuth: Authorization | null = await this.authRepo.findById(badgeId, gateId);
            if (gateAuth) {
                const requiredDPIs: string[] = gate.requiredDPIs || [];
                const usedDPIs: string[] = data.usedDPIs || [];

                dpiViolation = requiredDPIs.some(dpi => !usedDPIs.includes(dpi));
                if (!dpiViolation) authorized = TransitStatus.Authorized;
            }
        }

        if (authorized === TransitStatus.Unauthorized) {
            badge.unauthorizedAttempts = (badge.unauthorizedAttempts || 0) + 1;
            badge.firstUnauthorizedAttempt = badge.firstUnauthorizedAttempt || new Date();
            const currentDate: Date = new Date();
            const differenceInMinutes: number = (currentDate.getTime() - badge.firstUnauthorizedAttempt.getTime()) / (1000 * 60);

            const MAX_ATTEMPTS = parseInt(process.env.MAX_UNAUTHORIZED_ATTEMPTS || '3');
            const ATTEMPT_WINDOW = parseInt(process.env.UNAUTHORIZED_ATTEMPTS_WINDOW_MINUTES || '20');
            if (badge.unauthorizedAttempts >= MAX_ATTEMPTS && differenceInMinutes <= ATTEMPT_WINDOW) {
                badge.status = BadgeStatus.Suspended;
            }
        } else {
            badge.unauthorizedAttempts = 0;
            badge.firstUnauthorizedAttempt = null;
        }

        const badgeNewValue = {
            status: badge.status,
            unauthorizedAttempts: badge.unauthorizedAttempts,
            firstUnauthorizedAttempt: badge.firstUnauthorizedAttempt
        };

        await this.badgeRepo.update(badge, badgeNewValue);

        data.status = authorized;
        data.DPIviolation = dpiViolation;

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
            if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
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

    // handle case where start_date and end_date are not provided (the filter is optional)
    async generateGateReport(
        start_date: string,
        end_date: string,
        format: ReportFormats
    ): Promise<Buffer | string | object> {

        const startDate = new Date(start_date as string);
        const endDate = new Date(end_date as string);

        if (!start_date || !end_date) throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date and end date are required');
        if (start_date > end_date) throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date cannot be after end date');

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

    // handle case where start_date and end_date are not provided (the filter is optional)
    async generateBadgeReport(
        start_date: string,
        end_date: string,
        format: ReportFormats,
        user?: UserPayload
    ): Promise<Buffer | string | object> {

        if (!user) throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'User not authenticated');

        const startDate = new Date(start_date as string);
        const endDate = new Date(end_date as string);

        if (!start_date || !end_date) throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date and end date are required');
        if (start_date > end_date) throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date cannot be after end date');

        let transits: Transit[]
        const grouped: Record<string, BadgeTransitsReport> = {};

        if (user.role === UserRole.Admin) {
            transits = await this.repo.findAllInRange(startDate, endDate);
        } else {
            const badge: Badge | null = await this.badgeRepo.findByUserId(user.id);
            if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found for this user');
            return await this.repo.findByBadgeGateAndDate(badge.id, undefined, startDate, endDate);
        }

        const badgeIds: string[] = transits.map(t => t.badgeId);
        const badges: Badge[] = await this.badgeRepo.findManyFilteredById(badgeIds);
        const badgeMap: Map<string, Badge> = new Map(badges.map(b => [b.id, b]));

        for (const t of transits) {
            const badgeId: string = t.badgeId;

            if (!grouped[badgeId]) {
                const badge: Badge | undefined = badgeMap.get(badgeId);
                grouped[badgeId] = {
                    badgeId,
                    authorized: 0,
                    unauthorized: 0,
                    status: badge?.status ?? BadgeStatus.Suspended
                };
            }

            if (t.status === TransitStatus.Authorized) grouped[badgeId].authorized++;
            else grouped[badgeId].unauthorized++;
        }


        const reportData = Object.values(grouped);
        return await ReportFactory.format(format, reportData);
    }
}
