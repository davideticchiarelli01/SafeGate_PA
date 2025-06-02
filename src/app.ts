import express from 'express';
import dotenv from 'dotenv';
import DatabaseConnection from "./db/database";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Load environment variables from .env file
dotenv.config();
// Middleware to parse JSON bodies
app.use(express.json());
// Initialize the database connection
DatabaseConnection.getInstance();

app.get('/', (req, res) => {
    res.send('Hello from app!');
});