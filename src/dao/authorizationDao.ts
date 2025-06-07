import {Authorization, AuthorizationCreationAttributes} from "../models/authorization";
import {IDao} from "./dao";

/**
 * Data Access Object (DAO) for the `Authorization` model.
 * Provides methods to interact with the database for `Authorization` entities.
 * Implements the `IDao` interface for consistency across DAOs.
 */
export class AuthorizationDao implements IDao<Authorization, AuthorizationCreationAttributes> {

    /**
     * Retrieves a single `Authorization` record based on the provided badgeId and gateId.
     * @param {string} badgeId - UUID of the badge associated with the authorization.
     * @param {string} gateId - UUID of the gate associated with the authorization.
     * @returns {Promise<Authorization | null>} - The `Authorization` record if found, otherwise `null`.
     */
    async get(badgeId: string, gateId: string): Promise<Authorization | null> {
        return await Authorization.findOne({
            where: {
                badgeId,
                gateId
            }
        });
    }

    /**
     * Retrieves all `Authorization` records from the database.
     * @returns {Promise<Authorization[]>} - An array of all `Authorization` records.
     */
    async getAll(): Promise<Authorization[]> {
        return await Authorization.findAll();
    }

    /**
     * Creates a new `Authorization` record in the database.
     * @param {AuthorizationCreationAttributes} data - The data required to create a new `Authorization` record.
     * @returns {Promise<Authorization>} - The newly created `Authorization` record.
     */
    async create(data: AuthorizationCreationAttributes): Promise<Authorization> {
        return await Authorization.create(data);
    }

    /**
     * Deletes an existing `Authorization` record from the database.
     * @param {Authorization} authorization - The `Authorization` record to be deleted.
     * @returns {Promise<void>} - Resolves when the record is successfully deleted.
     */
    async delete(authorization: Authorization): Promise<void> {
        return await authorization.destroy();
    }
}