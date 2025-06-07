import { Dialect, Sequelize } from "sequelize";
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";
import { initModels } from "../models/initModels/initializationModels";

/**
 * Singleton class responsible for managing the Sequelize database connection.
 * Ensures only one instance of Sequelize is created and shared across the application.
 */
class DatabaseConnection {
    /** The single Sequelize instance shared across the application. */
    private static instance: Sequelize;

    /**
     * Private constructor to prevent direct instantiation.
     * This enforces the singleton pattern.
     */
    private constructor() {
    }

    /**
     * Retrieves the singleton Sequelize instance.
     * Initializes the connection and models if not already created.
     *
     * @returns {Sequelize} The Sequelize instance
     * @throws {HttpError} If any required environment variable is missing
     */
    public static getInstance(): Sequelize {
        if (!DatabaseConnection.instance) {
            const DB_NAME: string = process.env.DB_NAME || '';
            const DB_USER: string = process.env.DB_USER || '';
            const DB_PASS: string = process.env.DB_PASS || '';
            const DB_HOST: string = process.env.DB_HOST || '';
            const DB_DIALECT: Dialect = (process.env.DB_DIALECT as Dialect) || 'postgres';

            // Check for required environment variables
            if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST || !DB_DIALECT) {
                const msg = 'Missing environment variables for database connection'
                throw ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, msg);
            }

            // Initialize Sequelize instance
            const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
                host: DB_HOST,
                dialect: DB_DIALECT,
                logging: false,
            });

            // Initialize all models with the sequelize instance
            initModels(sequelize);

            // Store the instance for future use
            DatabaseConnection.instance = sequelize;
        }

        return DatabaseConnection.instance;
    }
}

export default DatabaseConnection;
