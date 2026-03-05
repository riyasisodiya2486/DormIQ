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

        // 1. Register a new owner
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

        // 3. Create a device in room 101
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
        await axios.patch(`http://localhost:5000/api/devices/${deviceId}`, {
            status: true
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Device status set to true");

        // 4. Send IoT update to force Occupied
        const iotRes1: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: true,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("IoT Update 1 (Occupied) Response Status:", iotRes1.status);
        console.log("IoT Update 1 Response Data:", JSON.stringify(iotRes1.data));

        // 5. Wait 1 second
        console.log("Waiting 1 second...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 6. Send IoT update (motion: false)
        const iotRes2: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: false,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("IoT Update 2 (No motion) Response Status:", iotRes2.status);
        console.log("IoT Update 2 Response Data:", JSON.stringify(iotRes2.data));

        // 7. Wait past idle threshold (IDLE_THRESHOLD_SECONDS = 10)
        console.log("Waiting 12 seconds for idle threshold...");
        await new Promise(resolve => setTimeout(resolve, 12000));

        // 8. Send another IoT update to trigger transition Occupied -> Idle
        const iotRes3: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: false,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("IoT Update 3 (Trigger Idle) Response Status:", iotRes3.status);
        console.log("IoT Update 3 Response Data:", JSON.stringify(iotRes3.data));

        // 9. Query the device from the database
        const finalDevice: any = await Device.findById(deviceId);
        if (!finalDevice) throw new Error("Device not found at end of test");

        console.log("device.status:", finalDevice.status);
        console.log("device.autoDisabled:", finalDevice.autoDisabled);

    } catch (error: any) {
        if (error.response) {
            console.error("HTTP Response Error Status:", error.response.status);
            console.error("HTTP Response Error Data:", JSON.stringify(error.response.data));
        } else {
            console.error("Error:", error.message);
        }
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
