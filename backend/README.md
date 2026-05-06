# DormIQ Backend

The backend server powers the DormIQ smart hostel infrastructure, dealing with IoT telemetry, real-time Socket.IO broadcasts, device automations, and analytics.

## Tech Stack
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Socket.IO
- JSON Web Tokens (JWT Auth)

## Setup & Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dormiq
   JWT_SECRET=your_jwt_super_secret_key
   ```
   *(Ensure MongoDB is running locally or specify a cloud Atlas URI)*

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## ESP32 IoT Integration

The ESP32 communicates with the backend via HTTP POST requests to update room environmental sensors. 

**Endpoint:** `POST /api/iot/update-room`

### Headers Required:
- `Content-Type: application/json`
- `Authorization: Bearer <JWT_TOKEN>` *(The ESP32 must authenticate using the hostel owner's JWT token)*

### Payload Format:
```json
{
  "roomNumber": "101",
  "motionDetected": true,
  "sleepProbability": 0.1
}
```

### Response Example:
```json
{
  "message": "Telemetry processed successfully",
  "roomStatus": "Occupied",
  "devicesAffected": 0
}
```

### How Energy Consumption is Calculated

Energy consumption is calculated sequentially on the backend using the **AutomationEngine**. 

1. **Power Rating:** Each device has a defined `powerRating` (in Watts). 
2. **Current Power Limit:** The `currentPower` of a room is simply the sum of the `powerRating` of all devices currently `status: true` (ON).
3. **Time-Based Accumulation:** Energy (Watt-hours) is not streamed continuously. Instead, when a device is turned ON, a `lastOnTimestamp` is saved. 
4. **State Change Calculation:** When a device is toggled OFF (either manually by the user or via the `AutomationEngine` detecting an empty room), the backend calculates the difference between `Date.now()` and `lastOnTimestamp` in hours.
   ```javascript
   const hoursON = (Date.now() - lastOnTimestamp) / (1000 * 60 * 60);
   const energyConsumed = powerRating * hoursON;
   ```
5. **Aggregation:** This calculated energy is cumulatively added to the room's `energyToday`.

*Note: For the best representation of live data, the ESP32 only sends motion updates. The backend `AutomationEngine` decides when to disable devices based on these updates.*
