import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { initSocket } from './utils/socket';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import deviceRoutes from './routes/deviceRoutes';
import iotRoutes from './routes/iotRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import automationRoutes from './routes/automationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dormIQ')
    .then(() => {
        console.log('MongoDB Connected');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err: Error) => {
        console.error('Database connection error:', err);
    });
