import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function initSocket(server: any) {
    io = new SocketIOServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}

export function emitRoomUpdated(roomId: string) {
    if (io) {
        io.emit('room:updated', { roomId });
    }
}

export function emitDeviceUpdated(roomId: string, deviceId: string) {
    if (io) {
        io.emit('device:updated', { roomId, deviceId });
    }
}

export function emitEnergyUpdated(ownerId: string) {
    if (io) {
        io.emit('energy:updated', { ownerId });
    }
}

export function emitRoomListUpdated(ownerId: string) {
    if (io) {
        io.emit('room:updated', { ownerId });
    }
}
