import {Sequelize, Transaction} from 'sequelize';
import DatabaseConnection from '../db/database';

export async function unitOfWork<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {

    const sequelize: Sequelize = DatabaseConnection.getInstance();

    return await sequelize.transaction(async (tx) => {
        return await callback(tx);
    });

}
