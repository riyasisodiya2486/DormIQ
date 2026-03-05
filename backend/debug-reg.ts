import axios from 'axios';

async function test() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            hostelName: 'Debug Hostel',
            email: `debug_${Date.now()}@example.com`,
            passwordRaw: 'password123',
            totalRooms: 5
        });
        console.log('Success:', res.data);
    } catch (err: any) {
        console.log('Status:', err.response?.status);
        console.log('Data:', err.response?.data);
        console.log('Message:', err.message);
    }
}

test();
