import {Dialect, Sequelize} from "sequelize";

class DatabaseConnection {
    private static instance: Sequelize;

    // Antipattern: Private constructor
    private constructor() {
    }

    public static getInstance(): Sequelize {
        if (!DatabaseConnection.instance) {
            const DB_NAME = process.env.DB_NAME as string;
            const DB_USER = process.env.DB_USER as string;
            const DB_PASS = process.env.DB_PASS as string;
            const DB_HOST = process.env.DB_HOST as string;
            const DB_DIALECT = process.env.DB_DIALECT as Dialect;

            if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST || !DB_DIALECT) {
                const msg = 'Missing environment variables for database connection'
                console.log(msg);
            } else {
                console.log(`Connecting to database ${DB_NAME} at ${DB_HOST} with user ${DB_USER}`);
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