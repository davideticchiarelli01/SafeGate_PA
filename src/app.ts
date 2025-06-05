import express from 'express';
import dotenv from 'dotenv';
import DatabaseConnection from "./db/database";
import GateRoute from "./routes/gateRoute";
import TransitRoute from "./routes/transitRoute";
import errorMiddleware from './middlewares/errorMiddleware';
import BadgeRoute from "./routes/badgeRoute";
import loginRoute from "./routes/loginRoute";
import authorizationRoute from "./routes/authorizationRoute";
import Logger from './logger/logger';

const app = express();
const PORT = process.env.APP_PORT || 3000;
// Load environment variables from .env file
dotenv.config();
// Middleware to parse JSON bodies
app.use(express.json());
// Initialize the database connection
DatabaseConnection.getInstance();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/logger", (_, res) => {
    Logger.error("This is an error log");
    Logger.warn("This is a warn log");
    Logger.info("This is a info log");
    Logger.http("This is a http log");
    Logger.debug("This is a debug log");

    res.send("Hello world");
});

app.use('/api', GateRoute);
app.use('/api', BadgeRoute);
app.use('/api', TransitRoute);
app.use('/api', authorizationRoute);
app.use('/api', loginRoute);

app.get('/', (req, res) => {
    res.send('Hello from app!');
});

app.use(errorMiddleware);