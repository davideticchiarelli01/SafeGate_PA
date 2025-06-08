import { Sequelize, Transaction } from 'sequelize';
import DatabaseConnection from '../db/database';

/**
 * Executes a set of database operations within a single transaction.
 * Ensures that all operations inside the callback are committed atomically,
 * or rolled back entirely if an error occurs.
 *
 * @template T - The return type of the transactional operation.
 * @param {(tx: Transaction) => Promise<T>} callback - A function that receives the Sequelize transaction and returns a promise.
 * @returns {Promise<T>} The result of the operation wrapped in a transaction.
 *
 */
export async function unitOfWork<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {

    const sequelize: Sequelize = DatabaseConnection.getInstance();

    return await sequelize.transaction(async (tx) => {
        return await callback(tx);
    });

}
