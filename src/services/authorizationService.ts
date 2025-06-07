import {AuthorizationRepository} from '../repositories/authorizationRepository';
import {BadgeRepository} from '../repositories/badgeRepository';
import {GateRepository} from '../repositories/gateRepository';
import {Authorization, AuthorizationCreationAttributes} from '../models/authorization';
import {ErrorFactory} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';
import {Gate} from "../models/gate";
import {Badge} from "../models/badge";

/**
 * Service class for handling business logic related to `Authorization` entities.
 * Provides methods for CRUD operations and validation of `Authorization` records.
 */
export class AuthorizationService {
    /**
     * Constructs an instance of `AuthorizationService`.
     * @param {AuthorizationRepository} authorizationRepo - Repository for `Authorization` data access.
     * @param {BadgeRepository} badgeRepo - Repository for `Badge` data access.
     * @param {GateRepository} gateRepo - Repository for `Gate` data access.
     */
    constructor(
        private readonly authorizationRepo: AuthorizationRepository,
        private readonly badgeRepo: BadgeRepository,
        private readonly gateRepo: GateRepository
    ) {
    }

    /**
     * Retrieves a specific `Authorization` record by `badgeId` and `gateId`.
     * Throws an error if the record is not found.
     * @param {string} badgeId - UUID of the badge associated with the authorization.
     * @param {string} gateId - UUID of the gate associated with the authorization.
     * @returns {Promise<Authorization>} - The `Authorization` record.
     * @throws {Error} - If the `Authorization` record is not found.
     */
    async getAuthorization(badgeId: string, gateId: string): Promise<Authorization> {
        const gateAuth: Authorization | null = await this.authorizationRepo.findById(badgeId, gateId);
        if (!gateAuth) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate authorization not found');
        return gateAuth;
    }

    /**
     * Retrieves all `Authorization` records.
     * @returns {Promise<Authorization[]>} - An array of all `Authorization` records.
     */
    getAllAuthorizations(): Promise<Authorization[]> {
        return this.authorizationRepo.findAll();
    }

    /**
     * Creates a new `Authorization` record.
     * Validates the existence of the associated `Badge` and `Gate` before creation.
     * Throws an error if the `Authorization` already exists or if the `Badge` or `Gate` are not found.
     * @param {AuthorizationCreationAttributes} data - The data required to create a new `Authorization` record.
     * @returns {Promise<Authorization>} - The newly created `Authorization` record.
     * @throws {Error} - If the `Badge` or `Gate` are not found, or if the `Authorization` already exists.
     */
    async createAuthorization(data: AuthorizationCreationAttributes): Promise<Authorization> {
        const {badgeId, gateId} = data;

        const badgeExists: Badge | null = await this.badgeRepo.findById(badgeId);
        if (!badgeExists) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        const gateExists: Gate | null = await this.gateRepo.findById(gateId);
        if (!gateExists) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');

        const gateAuth: Authorization | null = await this.authorizationRepo.findById(badgeId, gateId);
        if (gateAuth) throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'Authorization already exists');

        return this.authorizationRepo.create(data);
    }

    /**
     * Deletes a specific `Authorization` record by `badgeId` and `gateId`.
     * Throws an error if the record is not found.
     * @param {string} badgeId - UUID of the badge associated with the authorization.
     * @param {string} gateId - UUID of the gate associated with the authorization.
     * @returns {Promise<void>} - Resolves when the record is successfully deleted.
     * @throws {Error} - If the `Authorization` record is not found.
     */
    async deleteAuthorization(badgeId: string, gateId: string): Promise<void> {
        const authorization = await this.authorizationRepo.findById(badgeId, gateId);
        if (!authorization) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Authorization not found');
        return this.authorizationRepo.delete(authorization);
    }
}