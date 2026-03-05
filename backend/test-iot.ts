import axios from 'axios';
import mongoose from 'mongoose';
import Owner from './src/models/Owner';
import Room from './src/models/Room';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dormIQ');

        const email = `testowner_${Date.now()}@example.com`;
        const regRes: any = await axios.post('http://localhost:5000/api/auth/register', {
            hostelName: 'Test Hostel',
            email,
            passwordRaw: 'password123',
            totalRooms: 5
        });

        const token = regRes.data.token;
        const ownerId = regRes.data.user.id;

        // Change one room to '101'
        const room = await Room.findOne({ ownerId });
        if (room) {
            room.roomNumber = '101';
            await room.save();
        }

        // Send the test payload
        const response: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: true,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`HTTP Status: ${response.status}`);
        console.log(`JSON Response:\n${JSON.stringify(response.data, null, 2)}`);

    } catch (error: any) {
        console.log(`HTTP Status: ${error.response?.status || 'Unknown'}`);
        if (error.response?.data) {
            console.log(`Error Response:\n${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.log(`Error Message:\n${error.message}`);
        }
    } finally {
        await mongoose.disconnect();
    }
}

run();
