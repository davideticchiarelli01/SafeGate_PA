import {Authorization, AuthorizationCreationAttributes} from '../models/authorization';
import {AuthorizationDao} from '../dao/authorizationDao';
import {IRepository} from "./repository";

/**
 * Repository class for managing `Authorization` entities.
 * Provides methods for CRUD operations using the `AuthorizationDao`.
 * Implements the `IRepository` interface for consistency across repositories.
 */
export class AuthorizationRepository implements IRepository<Authorization, AuthorizationCreationAttributes> {
    /**
     * Constructs an instance of `AuthorizationRepository`.
     * @param {AuthorizationDao} dao - Data Access Object for `Authorization` operations.
     */
    constructor(private dao: AuthorizationDao) {
    }

    /**
     * Retrieves a specific `Authorization` record by `badgeId` and `gateId`.
     * @param {string} badgeId - UUID of the badge associated with the authorization.
     * @param {string} gateId - UUID of the gate associated with the authorization.
     * @returns {Promise<Authorization | null>} - The `Authorization` record if found, otherwise `null`.
     */
    findById(badgeId: string, gateId: string): Promise<Authorization | null> {
        return this.dao.get(badgeId, gateId);
    }

    /**
     * Retrieves all `Authorization` records.
     * @returns {Promise<Authorization[]>} - An array of all `Authorization` records.
     */
    findAll(): Promise<Authorization[]> {
        return this.dao.getAll();
    }

    /**
     * Creates a new `Authorization` record.
     * @param {AuthorizationCreationAttributes} data - The data required to create a new `Authorization` record.
     * @returns {Promise<Authorization>} - The newly created `Authorization` record.
     */
    create(data: AuthorizationCreationAttributes): Promise<Authorization> {
        return this.dao.create(data);
    }

    /**
     * Deletes an existing `Authorization` record.
     * @param {Authorization} authorization - The `Authorization` record to be deleted.
     * @returns {Promise<void>} - Resolves when the record is successfully deleted.
     */
    delete(authorization: Authorization): Promise<void> {
        return this.dao.delete(authorization);
    }
}