import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const registerOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { hostelName, email, passwordRaw, totalRooms } = req.body;

        if (!hostelName || !email || !passwordRaw || !totalRooms) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        const { token, user } = await AuthService.register(hostelName, email, passwordRaw, totalRooms);

        res.status(201).json({ token, user });
    } catch (error: any) {
        if (error.message === 'Email is already registered') {
            res.status(409).json({ message: error.message });
            return;
        }
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, passwordRaw } = req.body;

        if (!email || !passwordRaw) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }

        const { token, user } = await AuthService.login(email, passwordRaw);

        res.status(200).json({ token, user });
    } catch (error: any) {
        if (error.message === 'Invalid email or password') {
            res.status(401).json({ message: error.message });
            return;
        }
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
