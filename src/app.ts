import express from 'express';
import dotenv from 'dotenv';
import DatabaseConnection from "./db/database";
import GateRoute from "./routes/gateRoute";
import TransitRoute from "./routes/transitRoute";
import AuthRoute from "./routes/authorizationRoute";
import errorMiddleware from './middlewares/errorMiddleware';
import BadgeRoute from "./routes/badgeRoute";

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

app.use('/api', GateRoute);
app.use('/api', BadgeRoute);
app.use('/api', TransitRoute);
app.use('/api', AuthRoute);

app.get('/', (req, res) => {
    res.send('Hello from app!');
});

app.use(errorMiddleware);