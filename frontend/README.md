# DormIQ Frontend

DormIQ is a React dashboard for monitoring and managing smart hostel infrastructure.

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- TanStack React Query (Data Fetching / Caching)
- Zustand (State Management)
- Recharts (Data Visualization)
- Framer Motion (Animations)
- Socket.IO Client (Real-time updates)

## Features
- **Real-time Dashboard:** View live stats, occupancy distribution, and energy trends
- **Analytics:** In-depth power consumption, efficiency tracking, and breakdown by device
- **Room Management:** Visualize room states (Occupied, Idle, Sleeping) and connected devices
- **Demo Mode:** Toggleable setting that spins up realistic simulation data for presentation purposes, mutating seamlessly with zero backend API usage
- **Optimistic UI:** Instant device toggling with auto-rollback on failure

## Setup & Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (optional, as defaults connect to local backend):
   Make sure `src/utils/socket.ts` and `src/api/axios.ts` point to the correct backend (`http://localhost:5000` by default).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Design Architecture
- **State Management:** Zustand manages global configs like `demoMode`, `sidebarCollapsed`, and `socketConnected`. TanStack Query manages and caches server data (`rooms`, `stats`, `analytics`).
- **Real-time Sync:** WebSockets surgical patch query cache rather than doing full HTTP polling.
- **Demo Layer:** `mockData.ts` injected transparently when the backend returns empty results or Demo Mode is toggled to ensure the presentation layer never breaks.
