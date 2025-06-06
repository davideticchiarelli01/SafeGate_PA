import {Dialect, Sequelize} from "sequelize";
import {ErrorFactory} from "../factories/errorFactory";
import {ReasonPhrases} from "http-status-codes";

class DatabaseConnection {
    private static instance: Sequelize;

    // Antipattern: Private constructor
    private constructor() {
    }

    public static getInstance(): Sequelize {
        if (!DatabaseConnection.instance) {
            const DB_NAME: string = process.env.DB_NAME || '';
            const DB_USER: string = process.env.DB_USER || '';
            const DB_PASS: string = process.env.DB_PASS || '';
            const DB_HOST: string = process.env.DB_HOST || '';
            const DB_DIALECT: Dialect = (process.env.DB_DIALECT as Dialect) || 'postgres';

            if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST || !DB_DIALECT) {
                const msg = 'Missing environment variables for database connection'
                throw ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, msg);
            }

            DatabaseConnection.instance = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
                host: DB_HOST,
                dialect: DB_DIALECT,
                logging: false,
            });

        }
        return DatabaseConnection.instance;
    }
}

export default DatabaseConnection;