import axios from 'axios';
import mongoose from 'mongoose';

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let roomId = '';
let deviceId = '';

async function runTest() {
    try {
        console.log('--- 1. Register Owner ---');
        const timestamp = Date.now();
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            hostelName: 'Extension Test Hostel',
            email: `ext_test_${timestamp}@example.com`,
            passwordRaw: 'password123',
            totalRooms: 2
        });
        token = regRes.data.token;
        console.log('✅ Registered');

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n--- 2. Create Room ---');
        const roomRes = await axios.post(`${BASE_URL}/rooms`, { roomNumber: '999' }, authHeader);
        roomId = roomRes.data._id;
        console.log('✅ Room created:', roomRes.data.roomNumber);

        console.log('\n--- 3. Create Device ---');
        const deviceRes = await axios.post(`${BASE_URL}/devices`, {
            name: 'Test Light',
            type: 'light',
            roomNumber: '999',
            mode: 'Auto',
            protectedLoad: false,
            powerWatts: 100
        }, authHeader);
        deviceId = deviceRes.data._id;
        console.log('✅ Device created:', deviceRes.data.name);

        console.log('\n--- 4. Toggle Device ON/OFF ---');
        await axios.patch(`${BASE_URL}/devices/${deviceId}`, { status: true }, authHeader);
        console.log('✅ Device ON logged');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await axios.patch(`${BASE_URL}/devices/${deviceId}`, { status: false }, authHeader);
        console.log('✅ Device OFF logged');

        console.log('\n--- 5. Update Automation Config ---');
        const configRes = await axios.patch(`${BASE_URL}/automation/config`, {
            idleThresholdSeconds: 300,
            automationEnabled: true,
            nightModeStart: '22:00'
        }, authHeader);
        console.log('✅ Automation Config updated:', configRes.data.idleThresholdSeconds);

        console.log('\n--- 6. Fetch Dashboard Stats ---');
        const statsRes = await axios.get(`${BASE_URL}/dashboard/stats`, authHeader);
        console.log('✅ Dashboard Stats:', statsRes.data);

        console.log('\n--- 7. Fetch Analytics ---');
        const analyticsRes = await axios.get(`${BASE_URL}/analytics/overview`, authHeader);
        console.log('✅ Analytics fetched');
        console.log('Peak Hours Sample:', analyticsRes.data.peakUsageHours.slice(0, 1));

        console.log('\n🎉 Backend Extension Tests Passed!');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

runTest();
