import { IRepository } from "./repository";
import { UserDao } from "../dao/userDao";
import { User, UserAttributes, UserCreationAttributes } from "../models/user";

/**
 * Repository class for managing `User` entities.
 * Acts as an intermediary between the `UserDao` and the service layer.
 * Implements the `IRepository` interface.
 */
export class UserRepository implements IRepository<User, UserCreationAttributes, Partial<UserAttributes>> {

    /**
     * Constructs an instance of `UserRepository`.
     * @param {UserDao} userDao - The DAO used for direct database access for users.
     */
    constructor(private userDao: UserDao) {
    }

    /**
     * Retrieves a `User` by its unique ID.
     * @param {string} id - The ID of the user.
     * @returns {Promise<User | null>} The user if found, otherwise null.
     */
    findById(id: string): Promise<User | null> {
        return this.userDao.get(id);
    }

    /**
     * Retrieves all `User` records from the database.
     * @returns {Promise<User[]>} A list of all users.
     */
    findAll(): Promise<User[]> {
        return this.userDao.getAll();
    }

    /**
     * Retrieves a `User` by their email address.
     * @param {string} email - The email to search for.
     * @returns {Promise<User | null>} The user if found, otherwise null.
     */
    findByEmail(email: string): Promise<User | null> {
        return this.userDao.getByEmail(email);
    }

    /**
     * Creates a new `User` record.
     * @param {UserCreationAttributes} data - The data for the new user.
     * @returns {Promise<User>} The created user.
     */
    create(data: UserCreationAttributes): Promise<User> {
        return this.userDao.create(data);
    }

    /**
     * Updates an existing `User` record.
     * @param {User} user - The user instance to update.
     * @param {Partial<UserAttributes>} data - The fields to update.
     * @returns {Promise<User | null>} The updated user or null.
     */
    update(user: User, data: Partial<UserAttributes>): Promise<User | null> {
        return this.userDao.update(user, data);
    }

    /**
     * Deletes a `User` from the database.
     * @param {User} user - The user instance to delete.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    delete(user: User): Promise<void> {
        return this.userDao.delete(user);
    }
}
