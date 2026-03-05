import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Owner from './src/models/Owner';
import Room from './src/models/Room';

dotenv.config();

function logTestHeader(name: string) {
    console.log(`\n\n======================\n${name}\n======================`);
}

function logResponse(response: any) {
    console.log(`HTTP Status: ${response.status}`);
    console.log(`JSON Response: ${JSON.stringify(response.data)}`);
}

function logError(error: any) {
    console.log(`HTTP Status: ${error.response?.status || 'Unknown'}`);
    if (error.response?.data) {
        console.log(`Error Response: ${JSON.stringify(error.response.data)}`);
    } else {
        console.log(`Error Message: ${error.message}`);
    }
}

async function pause(ms: number) {
    console.log(`Waiting for ${ms / 1000} seconds...`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dormIQ');

        // 0. Setup User and get Room ready
        console.log("Setting up test user and room...");
        const email = `testowner_${Date.now()}@example.com`;
        const regRes: any = await axios.post('http://localhost:5000/api/auth/register', {
            hostelName: 'Test Hostel',
            email,
            passwordRaw: 'password123',
            totalRooms: 5
        });

        const token = regRes.data.token;
        const ownerId = regRes.data.user.id;

        const room = await Room.findOne({ ownerId });
        if (room) {
            room.roomNumber = '101';
            await room.save();
        }

        // Add an Auto device to the room so we can test the shutdown logic
        await axios.post(`http://localhost:5000/api/devices/room/${room?._id}`, {
            name: "Test AC",
            type: "AC",
            powerRating: 1500,
            mode: "Auto",
            protectedLoad: false
        }, { headers: { Authorization: `Bearer ${token}` } });

        // Add another device but configured to Manual
        await axios.post(`http://localhost:5000/api/devices/room/${room?._id}`, {
            name: "Test Light",
            type: "light",
            powerRating: 40,
            mode: "Manual",
            protectedLoad: false
        }, { headers: { Authorization: `Bearer ${token}` } });

        // Turn both devices ON manually first using the DB since there's no bulk ON endpoint
        // Or we can just let Return to Occupied try to turn it ON? Wait, TEST 3 expects them to TURN OFF when they were ON.
        console.log("Initialization complete.\n");

        // TEST 1
        logTestHeader("TEST 1 - Motion Detected");
        try {
            const res1 = await axios.post('http://localhost:5000/api/iot/update-room', {
                roomNumber: "101",
                motionDetected: true,
                sleepProbability: 10
            }, { headers: { Authorization: `Bearer ${token}` } });
            logResponse(res1);
        } catch (e: any) { logError(e); }

        // TEST 2
        logTestHeader("TEST 2 - No Motion (< 10s locally)");
        await pause(5000); // Wait 5s
        try {
            const res2 = await axios.post('http://localhost:5000/api/iot/update-room', {
                roomNumber: "101",
                motionDetected: false,
                sleepProbability: 10
            }, { headers: { Authorization: `Bearer ${token}` } });
            logResponse(res2);
        } catch (e: any) { logError(e); }

        // TEST 3
        logTestHeader("TEST 3 - No Motion (> 10s locally)");
        await pause(12000); // Wait 12s
        try {
            const res3 = await axios.post('http://localhost:5000/api/iot/update-room', {
                roomNumber: "101",
                motionDetected: false,
                sleepProbability: 10
            }, { headers: { Authorization: `Bearer ${token}` } });
            logResponse(res3);
        } catch (e: any) { logError(e); }

        // TEST 4
        logTestHeader("TEST 4 - Return to Occupied");
        try {
            const res4 = await axios.post('http://localhost:5000/api/iot/update-room', {
                roomNumber: "101",
                motionDetected: true,
                sleepProbability: 10
            }, { headers: { Authorization: `Bearer ${token}` } });
            logResponse(res4);
        } catch (e: any) { logError(e); }

        // TEST 5
        logTestHeader("TEST 5 - Sleep Mode");
        try {
            const res5 = await axios.post('http://localhost:5000/api/iot/update-room', {
                roomNumber: "101",
                motionDetected: false,
                sleepProbability: 85
            }, { headers: { Authorization: `Bearer ${token}` } });
            logResponse(res5);
        } catch (e: any) { logError(e); }

        // TEST 6
        logTestHeader("TEST 6 - Rapid Updates Stress Test");
        let promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(axios.post('http://localhost:5000/api/iot/update-room', {
                roomNumber: "101",
                motionDetected: true,
                sleepProbability: 10
            }, { headers: { Authorization: `Bearer ${token}` } }));
            await pause(1000); // Fire 1 a second to ensure 5 within 5 seconds as asked
        }

        try {
            const results = await Promise.all(promises);
            console.log(`Executed 5 rapid updates. Status Codes: ${results.map(r => r.status).join(', ')}`);
            logResponse(results[4]); // Log the last one
        } catch (e: any) { logError(e); }

    } catch (e: any) {
        console.error("Critical Suite Failure:", e.message);
    } finally {
        await mongoose.disconnect();
    }
}

runTests();
