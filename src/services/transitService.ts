/**
 * TransitService handles business logic related to transit registration, access control,
 * DPI checks, unauthorized access handling, badge suspension, and report generation.
 */
import {TransitRepository} from "../repositories/transitRepository";
import {BadgeRepository} from "../repositories/badgeRepository";
import {AuthorizationRepository} from "../repositories/authorizationRepository";
import {GateRepository} from "../repositories/gateRepository";
import {UserPayload} from "../utils/userPayload";
import {ErrorFactory} from "../factories/errorFactory";
import {ReasonPhrases} from "http-status-codes";
import {Transit, TransitCreationAttributes, TransitUpdateAttributes} from "../models/transit";
import {UserRole} from "../enum/userRoles";
import {TransitStatus} from "../enum/transitStatus";
import {Gate} from "../models/gate";
import {Badge, BadgeUpdateAttributes} from "../models/badge";
import {BadgeStatus} from "../enum/badgeStatus";
import {Authorization} from "../models/authorization";
import {ReportFactory} from "../factories/reportFactory";
import {ReportFormats} from "../enum/reportFormats";
import {BadgeTransitsReport, GateTransitsReport} from "../factories/reportFactory";
import Logger from "../logger/logger";
import {DPI} from "../enum/dpi";
import {unitOfWork} from "../utils/unitOfWork";

/**
 * Service class for handling `Transit` related operations.
 * Provides methods for creating, retrieving, updating, deleting transits,
 * generating reports, and enforcing badge and DPI validation logic.
 */
export class TransitService {

    /** Maximum number of unauthorized attempts before suspension. */
    private static readonly MAX_ATTEMPTS: number = parseInt(process.env.MAX_UNAUTHORIZED_ATTEMPTS || '3');

    /** Time window in minutes to consider for unauthorized attempts. */
    private static readonly ATTEMPT_WINDOW: number = parseInt(process.env.UNAUTHORIZED_ATTEMPTS_WINDOW_MINUTES || '20');

    /**
     * Constructs an instance of `TransitService`.
     * @param {TransitRepository} transitRepo - Repository for `Transit` data access.
     * @param {BadgeRepository} badgeRepo - Repository for `Badge` data access.
     * @param {GateRepository} gateRepo - Repository for `Gate` data access.
     * @param {AuthorizationRepository} authRepo - Repository for `Authorization` data access.
     */
    constructor(
        private transitRepo: TransitRepository,
        private badgeRepo: BadgeRepository,
        private gateRepo: GateRepository,
        private authRepo: AuthorizationRepository
    ) {
    }

    /**
     * Retrieves a specific `Transit` by ID, checking user permissions.
     * @param {string} id - The ID of the transit record.
     * @param {UserPayload} [user] - The user requesting the data.
     * @returns {Promise<Transit | null>} The transit record if authorized.
     * @throws {HttpError} If not authenticated or not authorized.
     */
    async getTransit(id: string, user?: UserPayload): Promise<Transit | null> {

        if (!user) throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'User not authenticated');

        const transit: Transit | null = await this.transitRepo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');

        switch (user.role) {
            case UserRole.Admin:
                return transit;

            case UserRole.User:
                const badge: Badge | null = await this.badgeRepo.findById(transit.badgeId);

                if (!badge) {
                    throw ErrorFactory.createError(
                        ReasonPhrases.NOT_FOUND,
                        'Badge associated with this transit not found'
                    );
                }

                if (badge.userId !== user.id) {
                    throw ErrorFactory.createError(
                        ReasonPhrases.NOT_FOUND,
                        'Transit not found for this user'
                    );
                }

                return transit;

            case UserRole.Gate:
            default:
                throw ErrorFactory.createError(
                    ReasonPhrases.FORBIDDEN,
                    'Access to this resource is not allowed'
                );
        }
    }

    /**
     * Retrieves all transit records.
     * @returns {Promise<Transit[]>} A list of all transits.
     */
    getAllTransits(): Promise<Transit[]> {
        return this.transitRepo.findAll();
    }

    /**
     * Creates a new `Transit` record, performing validation on badge, gate, and DPI.
     * Applies automatic suspension logic if unauthorized attempts exceed limits.
     * @param {TransitCreationAttributes} data - The data for the new transit.
     * @returns {Promise<Transit>} The created transit record.
     * @throws {HttpError} If gate or badge is not found.
     */
    async createTransit(data: TransitCreationAttributes): Promise<Transit> {
        const {gateId, badgeId, usedDPIs = []} = data;

        const gate: Gate | null = await this.gateRepo.findById(gateId);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');

        const badge: Badge | null = await this.badgeRepo.findById(badgeId);
        if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        // Sanity check number attempts and date of the first unauthorized attempt
        const MAX: number = TransitService.MAX_ATTEMPTS;
        const WINDOW: number = TransitService.ATTEMPT_WINDOW; // in minutes
        const now: number = Date.now();

        // Check if the badge has unauthorized attempts and if the time window has expired
        if (badge.firstUnauthorizedAttempt) {
            const firstAttemptTime: number = new Date(badge.firstUnauthorizedAttempt).getTime();
            const diffMinutes: number = (now - firstAttemptTime) / (1000 * 60);

            const windowExpired: boolean = diffMinutes > WINDOW || diffMinutes < 0;
            if (windowExpired) {
                badge.unauthorizedAttempts = 0;
                badge.firstUnauthorizedAttempt = null;
            }
        }

        // Reset unauthorized attempts if they exceed the maximum allowed
        if ((badge.unauthorizedAttempts ?? 0) >= MAX) {
            badge.unauthorizedAttempts = 0;
            badge.firstUnauthorizedAttempt = null;
        }

        // Access control logic
        let status: TransitStatus = TransitStatus.Unauthorized;
        let dpiViolation: boolean = false;
        let message: string = 'Unauthorized access attempt';

        if (badge.status === BadgeStatus.Active) {
            const gateAuth: Authorization | null = await this.authRepo.findById(badgeId, gateId);
            if (gateAuth) {
                const requiredDPIs: DPI[] = gate.requiredDPIs || [];
                dpiViolation = !requiredDPIs.every(dpi =>
                    usedDPIs.filter(d => d === dpi).length >= requiredDPIs.filter(d => d === dpi).length
                );
                if (!dpiViolation) {
                    status = TransitStatus.Authorized;
                } else {
                    message = 'DPI violation detected';
                }
            }
        } else {
            message = `Badge is not active, current status: ${badge.status}`;
        }

        // Set variables for access insert
        const badgeUpdate: BadgeUpdateAttributes = {};

        if (status === TransitStatus.Unauthorized) {
            const isFirstAttempt: boolean = (badge.unauthorizedAttempts ?? 0) === 0;
            badgeUpdate.unauthorizedAttempts = (badge.unauthorizedAttempts ?? 0) + 1;
            badgeUpdate.firstUnauthorizedAttempt = isFirstAttempt
                ? new Date()
                : badge.firstUnauthorizedAttempt ?? new Date();

            const diffMinutes: number = (Date.now() - new Date(badgeUpdate.firstUnauthorizedAttempt).getTime()) / (1000 * 60);
            if (badgeUpdate.unauthorizedAttempts >= MAX && diffMinutes <= WINDOW) {
                badgeUpdate.status = BadgeStatus.Suspended;
            }
        } else {
            badgeUpdate.unauthorizedAttempts = 0;
            badgeUpdate.firstUnauthorizedAttempt = null;
        }

        // Update badge and create transit (using transaction)
        data.status = status;
        data.DPIviolation = dpiViolation;

        const transit = await unitOfWork(async (tx) => {
            await this.badgeRepo.update(badge, badgeUpdate, {transaction: tx});
            return await this.transitRepo.create(data, {transaction: tx});
        });

        // Logging
        const log = status === TransitStatus.Authorized ? Logger.info : Logger.warn;
        log(`Transit: badge=${badgeId}, gate=${gateId}, status=${status}, DPI=${dpiViolation}, msg=${message}`);

        return transit;
    }

    /**
     * Updates an existing `Transit` record.
     * @param {string} id - The ID of the transit to update.
     * @param {TransitUpdateAttributes} data - The updated fields.
     * @returns {Promise<Transit>} The updated transit record.
     * @throws {HttpError} If the transit is not found.
     */
    async updateTransit(id: string, data: TransitUpdateAttributes): Promise<Transit> {
        const transit: Transit | null = await this.transitRepo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        return this.transitRepo.update(transit, data);
    }

    /**
     * Deletes a `Transit` record by ID.
     * @param {string} id - The ID of the transit to delete.
     * @returns {Promise<void>} Resolves when deletion is complete.
     * @throws {HttpError} If the transit is not found.
     */
    async deleteTransit(id: string): Promise<void> {
        const transit: Transit | null = await this.transitRepo.findById(id);
        if (!transit) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Transit not found');
        return this.transitRepo.delete(transit);
    }

    /**
     * Retrieves aggregated transit statistics for a specific badge,
     * optionally filtered by gate and date range.
     * @param {string} badgeId - The badge ID to retrieve stats for.
     * @param {string} [gateId] - Optional gate filter.
     * @param {Date} [startDate] - Optional start date filter.
     * @param {Date} [endDate] - Optional end date filter.
     * @returns {Promise<object>} An object with total counts and gate-level stats.
     * @throws {HttpError} If badge or gate not found, or date range is invalid.
     */
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

        const transits: Transit[] = await this.transitRepo.findByBadgeGateAndDate(badgeId, gateId, startDate, endDate);

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

    /**
     * Generates a report of transits grouped by gate.
     * @param {ReportFormats} format - The desired report format (e.g., JSON, PDF).
     * @param {Date} [startDate] - Optional start date filter.
     * @param {Date} [endDate] - Optional end date filter.
     * @returns {Promise<Buffer | string | object>} The formatted report data.
     * @throws {HttpError} If date range is invalid.
     */
    async generateGateReport(
        format: ReportFormats,
        startDate?: Date,
        endDate?: Date,
    ): Promise<Buffer | string | object> {

        if (startDate && endDate && startDate > endDate) {
            throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date cannot be after end date');
        }

        const transits: Transit[] = await this.transitRepo.findAllInRange(startDate, endDate);
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

    /**
     * Generates a report of transits grouped by badge.
     * Only returns user-specific data unless the user is an admin.
     * @param {ReportFormats} format - The desired report format.
     * @param {Date} [startDate] - Optional start date filter.
     * @param {Date} [endDate] - Optional end date filter.
     * @param {UserPayload} [user] - The requesting user.
     * @returns {Promise<Buffer | string | object>} The formatted report data.
     * @throws {HttpError} If unauthorized or badge not found for user.
     */
    async generateBadgeReport(
        format: ReportFormats,
        startDate?: Date,
        endDate?: Date,
        user?: UserPayload
    ): Promise<Buffer | string | object> {

        if (!user) throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'User not authenticated');

        if (startDate && endDate && startDate > endDate) {
            throw ErrorFactory.createError(ReasonPhrases.BAD_REQUEST, 'Start date cannot be after end date');
        }

        let transits: Transit[]
        const grouped: Record<string, BadgeTransitsReport> = {};

        if (user.role === UserRole.Admin) {
            transits = await this.transitRepo.findAllInRange(startDate, endDate);
        } else {
            const badge: Badge | null = await this.badgeRepo.findByUserId(user.id);
            if (!badge) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found for this user');
            transits = await this.transitRepo.findByBadgeGateAndDate(badge.id, undefined, startDate, endDate); //there was a return
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
