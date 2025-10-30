import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(
    pino({
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorise: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
                hideObject: true,
            },
        },
    }),
);

const PORT = process.env.PORT ?? 3000;

app.get('/notes', (req, res) => {
    res.status(200).json({
        message: "Retrievedd all notes",
    });
});

app.get('/notes/:noteId', (req, res) => {
    console.log(req.params);
    const { noteId } = req.params;
    res.status(200).json({
        message: `Retrieved note with ID: ${noteId}`
    });
});


app.get('/test-error', () => {
    throw new Error('Simulated server error');
});

app.use((err, req, res, next) => {
    console.error(err);
    const isProd = process.env.NODE_ENV === "production";

    res.status(500).json({
        message: isProd ? "Something went wrong. Please try again later." : err.message,
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
