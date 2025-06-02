import express from 'express';

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello from app!');
});