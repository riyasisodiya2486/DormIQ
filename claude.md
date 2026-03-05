Initialize a full-stack IoT application.

Project Name:
Smart Energy Optimization System (Single Hostel Owner)

Architecture:

Frontend:
- Next.js 14 (App Router)
- Tailwind CSS
- Recharts
- Context API

Backend:
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- REST APIs only

System Type:
Single hostel owner system.

Core Functional Requirements:

1. Owner registers and enters:
   - Hostel Name
   - Number of Rooms

2. Rooms are auto-created.

3. Devices are NOT identical per room.
   - Owner can add/remove devices per room.
   - Devices have:
     - Name
     - Type (light, fan, socket, AC, fridge, etc.)
     - Power rating (Watt)
     - Mode (Auto/Manual)
     - Protected load option

4. Each room tracks:
   - Occupancy status
   - Current power usage
   - Energy today
   - Automation rules

5. Must support future ESP32 hardware updates via REST.

Non-Negotiables:
- Clean modular architecture
- Hardware-ready endpoints
- Logical energy calculation
- Dark IoT dashboard theme
- Production-ready structure

Initialize strictly following these rules.