const express = require('express');
const cors = require('cors');

const aboutRoutes = require('./routes/aboutRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ─── Global Middleware ──────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────
app.use('/api/about', aboutRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// ─── Health Check ───────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Portfolio API is running' });
});

module.exports = app;
