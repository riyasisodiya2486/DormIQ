import axios from 'axios';

async function ping() {
    try {
        const res = await axios.get('http://localhost:5000/api/rooms'); // Should be 401 but reachable
        console.log('Status:', res.status);
    } catch (err: any) {
        console.log('Error Status:', err.response?.status);
        console.log('Error Message:', err.message);
    }
}

ping();
