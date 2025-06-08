import { IDao } from "./dao";
import { User, UserAttributes, UserCreationAttributes } from "../models/user";

/**
 * Data Access Object (DAO) for the `User` model.
 * Provides methods to interact with the database for `User` entities.
 * Implements the `IDao` interface for consistency across DAOs.
 */
export class UserDao implements IDao<User, UserCreationAttributes, Partial<UserAttributes>> {

    constructor() {
    }

    /**
     * Retrieves a `User` record by its primary key (ID).
     * @param {string} id - UUID of the user to retrieve.
     * @returns {Promise<User | null>} - The `User` record if found, otherwise `null`.
     */
    async get(id: string): Promise<User | null> {
        return await User.findByPk(id);
    }

    /**
     * Retrieves all `User` records from the database.
     * @returns {Promise<User[]>} - An array of all `User` records.
     */
    async getAll(): Promise<User[]> {
        return await User.findAll();
    }

    /**
     * Retrieves a `User` record by its email.
     * @param {string} email - The email of the user to retrieve.
     * @returns {Promise<User | null>} - The `User` record if found, otherwise `null`.
     */
    async getByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }

    /**
     * Creates a new `User` record in the database.
     * @param {UserCreationAttributes} data - The data required to create a new user.
     * @returns {Promise<User>} - The newly created `User` record.
     */
    async create(data: UserCreationAttributes): Promise<User> {
        return await User.create(data);
    }

    /**
     * Updates an existing `User` record in the database.
     * @param {User} user - The user instance to update.
     * @param {Partial<UserAttributes>} data - The data to update on the user.
     * @returns {Promise<User>} - The updated `User` record.
     */
    async update(user: User, data: Partial<UserAttributes>): Promise<User> {
        return await user.update(data);
    }

    /**
     * Deletes a `User` record from the database.
     * @param {User} user - The user instance to delete.
     * @returns {Promise<void>} - Resolves when the record is successfully deleted.
     */
    async delete(user: User): Promise<void> {
        if (user) await user.destroy();
    }
}

