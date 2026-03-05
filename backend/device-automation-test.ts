import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './src/models/Room';
import Device from './src/models/Device';

dotenv.config();

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dormIQ');
        console.log("Connected to MongoDB");

        // 1. Register a test owner
        const email = `test_owner_${Date.now()}@test.com`;
        const registerRes: any = await axios.post('http://localhost:5000/api/auth/register', {
            hostelName: 'Test Hostel',
            email: email,
            passwordRaw: 'password123',
            totalRooms: 1
        });
        console.log("Register Response Status:", registerRes.status);
        const { token, user } = registerRes.data;

        // 2. Ensure room "101" exists
        const room: any = await Room.findOne({ ownerId: user.id });
        if (!room) throw new Error("Room not found");
        room.roomNumber = "101";
        await room.save();
        console.log("Room renamed to 101");

        // 2b. Set initial state to Occupied
        const initRes: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: true,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Initial (Occupied) Response:", JSON.stringify(initRes.data, null, 2));

        // 3. Create a device in the room
        const deviceRes: any = await axios.post(`http://localhost:5000/api/devices/room/${room._id}`, {
            name: "Test Light",
            type: "light",
            powerRating: 60,
            mode: "Auto",
            protectedLoad: false
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Device Creation Response Status:", deviceRes.status);

        const deviceId = deviceRes.data._id;

        // Ensure status is true
        const toggleRes: any = await axios.patch(`http://localhost:5000/api/devices/${deviceId}`, {
            status: true
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Device Toggle ON Response Status:", toggleRes.status);

        // 4. Send an IoT update with motionDetected = false (But still within threshold)
        const iotRes1: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: false,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("IoT Update 1 (Still Occupied?) Response:", JSON.stringify(iotRes1.data, null, 2));

        // 5. Wait past the idle threshold (10 seconds)
        console.log("Waiting 12 seconds for idle threshold...");
        await new Promise(resolve => setTimeout(resolve, 12000));

        // 6. Send another update (Trigger transition to Idle)
        const iotRes2: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: false,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("IoT Update 2 (Idle transition) Response:", JSON.stringify(iotRes2.data, null, 2));

        // 7. Verify device status became OFF and autoDisabled = true
        const finalDevice: any = await Device.findById(deviceId);
        if (!finalDevice) throw new Error("Device not found at end of test");

        console.log("Final Device status:", finalDevice.status);
        console.log("Final Device autoDisabled:", finalDevice.autoDisabled);

    } catch (error: any) {
        if (error.response) {
            console.error("HTTP Error Status:", error.response.status);
            console.error("HTTP Error Response:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
