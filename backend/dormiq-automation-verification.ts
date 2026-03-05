import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './src/models/Room';
import Device from './src/models/Device';

dotenv.config();

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dormIQ');
        console.log('--- TEST START ---');

        // 1. Register a new owner
        const email = `testowner_${Date.now()}@example.com`;
        console.log(`Step 1: Registering owner with email: ${email}`);
        const regRes: any = await axios.post('http://localhost:5000/api/auth/register', {
            hostelName: "Test Hostel",
            email,
            passwordRaw: "password123",
            totalRooms: 5
        });
        console.log('Register Status:', regRes.status);
        console.log('Register Response:', JSON.stringify(regRes.data));
        const token = regRes.data.token;
        const ownerId = regRes.data.user.id;

        // 2. Ensure room "101" exists
        console.log('Step 2: Ensuring room "101" exists');
        let room: any = await Room.findOne({ ownerId, roomNumber: "101" });
        if (!room) {
            console.log('Room "101" not found. Updating "Room 1" to "101"');
            room = await Room.findOne({ ownerId, roomNumber: "Room 1" });
            if (!room) throw new Error("Default rooms not found");
            room.roomNumber = "101";
            await room.save();
        }
        console.log('Room Ready:', room.roomNumber);

        // 3. Create a device in room 101
        console.log('Step 3: Creating device in room 101');
        const deviceRes: any = await axios.post('http://localhost:5000/api/devices', {
            name: "Test Light",
            roomNumber: "101",
            type: "light",
            powerRating: 60, // Added powerRating as it is required in schema
            mode: "Auto",
            protectedLoad: false,
            status: true
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Device Create Status:', deviceRes.status);
        console.log('Device Create Response:', JSON.stringify(deviceRes.data));
        const deviceId = deviceRes.data._id;

        // 4. Send IoT update to force Occupied
        console.log('Step 4: Sending IoT update to force Occupied');
        const iotRes1: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: true,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('IoT Update 1 Status:', iotRes1.status);
        console.log('IoT Update 1 Response:', JSON.stringify(iotRes1.data));

        // 5. Wait 1 second
        console.log('Step 5: Waiting 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 6. Send IoT update with no motion
        console.log('Step 6: Sending IoT update with no motion');
        const iotRes2: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: false,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('IoT Update 2 Status:', iotRes2.status);
        console.log('IoT Update 2 Response:', JSON.stringify(iotRes2.data));

        // 7. Wait past the idle threshold (10 seconds for local testing)
        console.log('Step 7: Waiting 12 seconds past idle threshold...');
        await new Promise(resolve => setTimeout(resolve, 12000));

        // 8. Send another IoT update
        console.log('Step 8: Sending final IoT update (Idle transition)');
        const iotRes3: any = await axios.post('http://localhost:5000/api/iot/update-room', {
            roomNumber: "101",
            motionDetected: false,
            sleepProbability: 10
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('IoT Update 3 Status:', iotRes3.status);
        console.log('IoT Update 3 Response:', JSON.stringify(iotRes3.data));

        // 9. Query the device directly from MongoDB using the stored deviceId
        console.log('Step 9: Querying device from database');
        const finalDevice: any = await Device.findById(deviceId);

        console.log('--- TEST RESULT ---');
        console.log('device.status:', finalDevice?.status);
        console.log('device.autoDisabled:', finalDevice?.autoDisabled);

    } catch (e: any) {
        if (e.response) {
            console.error('HTTP Error Status:', e.response.status);
            console.error('HTTP Error Response:', JSON.stringify(e.response.data));
        } else {
            console.error('Error:', e.message);
        }
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
