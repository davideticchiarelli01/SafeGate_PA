import express from 'express';
import dotenv from 'dotenv';
import DatabaseConnection from "./db/database";
import GateRoute from "./routes/gateRoute";
import TransitRoute from "./routes/transitRoute";
import {errorMiddlewares} from './middlewares/errorMiddleware';
import BadgeRoute from "./routes/badgeRoute";
import loginRoute from "./routes/loginRoute";
import authorizationRoute from "./routes/authorizationRoute";
import {ErrorFactory, HttpError} from "./factories/errorFactory";
import {ReasonPhrases} from "http-status-codes";

const app = express();
const PORT: string = process.env.APP_PORT || '3000';

// Load environment variables from .env file
dotenv.config();

/**
 * Middleware to parse incoming JSON request bodies.
 * @middleware express.json - Parses application/json payloads.
 */
app.use(express.json());

/**
 * Initializes the database connection (singleton instance).
 * Ensures that Sequelize is configured and connected.
 */
DatabaseConnection.getInstance();

/**
 * Starts the Express server on the specified port.
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/**
 * Register route modules.
 * Each route module handles a specific domain entity.
 *
 * @routes
 *   - GateRoute
 *   - BadgeRoute
 *   - TransitRoute
 *   - AuthorizationRoute
 *   - LoginRoute
 */
app.use(GateRoute);
app.use(BadgeRoute);
app.use(TransitRoute);
app.use(authorizationRoute);
app.use(loginRoute);

/**
 * Root route for verifying API availability.
 * @route GET /
 * @returns {string} Simple message response.
 */
app.get('/', (_req, res) => {
    res.send('Hello from app!');
});

/**
 * Middleware to handle requests to undefined routes.
 * Creates a `HttpError` with a 404 status and passes it to the next middleware.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} _res - The Express response object (unused).
 * @param {NextFunction} next - The Express next middleware function.
 */
app.use((req, _res, next) => {
    const msg: string = `Route ${req.originalUrl} not found`;
    const error: HttpError = ErrorFactory.createError(ReasonPhrases.NOT_FOUND, msg);
    next(error);
});

/**
 * Registers global error-handling middleware.
 * Should be loaded after all routes.
 * @middleware errorMiddlewares - Handles various types of runtime and HTTP errors.
 */
app.use(errorMiddlewares);