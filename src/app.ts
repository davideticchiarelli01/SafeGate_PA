import express from 'express';
import dotenv from 'dotenv';
import DatabaseConnection from "./db/database";
import GateRoute from "./routes/gateRoute";
import AuthRoute from "./routes/authorizationRoute";
import errorMiddleware from './middlewares/errorMiddleware';

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
app.use('/api/auth', AuthRoute);

app.get('/', (req, res) => {
    res.send('Hello from app!');
});

app.use(errorMiddleware);