import React, { useState } from 'react';
import { useRooms, useCreateRoom, useDeleteRoom } from '../hooks/useRooms';
import { useAddDevice, useRemoveDevice } from '../hooks/useDevices';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { Badge } from '../components/ui/Badge';
import {
    Trash2,
    Monitor,
    DoorOpen,
    Search,
    Zap,
    AlertTriangle
} from 'lucide-react';

const Admin: React.FC = () => {
    const { data: rooms, isLoading: roomsLoading } = useRooms();
    const createRoom = useCreateRoom();
    const deleteRoom = useDeleteRoom();
    const addDevice = useAddDevice();
    const removeDevice = useRemoveDevice();

    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newDevice, setNewDevice] = useState({ name: '', type: 'light', powerWatts: '10', roomNumber: '' });
    const [tab, setTab] = useState<'Rooms' | 'Devices'>('Rooms');

    if (roomsLoading) return <Loader fullPage />;

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoomNumber) return;
        createRoom.mutate(newRoomNumber);
        setNewRoomNumber('');
    };

    const handleAddDevice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDevice.name || !newDevice.roomNumber) return;
        addDevice.mutate({
            name: newDevice.name,
            type: newDevice.type,
            powerWatts: parseInt(newDevice.powerWatts),
            roomNumber: newDevice.roomNumber
        });
        setNewDevice({ name: '', type: 'light', powerWatts: '10', roomNumber: '' });
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white italic">INFRA <span className="text-primary not-italic">ADMIN</span></h1>
                    <p className="text-white/40 font-medium mt-1">Manage physical resources and hardware provisioning.</p>
                </div>
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                    {['Rooms', 'Devices'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all
                            ${tab === t ? 'bg-primary text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tables Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card hover={false} className="p-0 overflow-hidden border-white/5">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <h3 className="font-bold text-white text-lg tracking-tight">Active Inventory</h3>
                            <div className="relative group max-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 h-3.5 w-3.5" />
                                <input type="text" placeholder="Filter table..." className="w-full bg-white/5 border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.01] text-[10px] uppercase font-black tracking-[0.2em] text-white/30 border-b border-white/5">
                                    {tab === 'Rooms' ? (
                                        <tr>
                                            <th className="px-6 py-4">Room #</th>
                                            <th className="px-6 py-4">Occupancy</th>
                                            <th className="px-6 py-4">Load</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th className="px-6 py-4">Device Name</th>
                                            <th className="px-6 py-4">Room</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tab === 'Rooms' ? (
                                        rooms?.map((room) => (
                                            <tr key={room._id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">{room.roomNumber}</div>
                                                        <span className="text-sm font-bold text-white/80">{room._id.slice(-6)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={room.occupancyStatus === 'Occupied' ? 'success' : 'warning'}>
                                                        {room.occupancyStatus}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono text-white/40">{room.currentPower}W</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => deleteRoom.mutate(room._id)}
                                                        className="p-2 text-white/20 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        rooms?.flatMap(r => r.devices || []).map((dev: any) => (
                                            <tr key={dev._id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Monitor size={14} /></div>
                                                        <span className="text-sm font-bold text-white/80">{dev.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white/40 font-medium">Room {dev.roomNumber}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${dev.status ? 'bg-accent shadow-[0_0_8px_#22C55E]' : 'bg-white/10'}`} />
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${dev.status ? 'text-accent' : 'text-white/20'}`}>
                                                            {dev.status ? 'Active' : 'Offline'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => removeDevice.mutate(dev._id)}
                                                        className="p-2 text-white/20 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Provisioning Section */}
                <div className="space-y-6">
                    {/* Add Room */}
                    <Card title="Register Room" description="Initialize a new smart living space.">
                        <form onSubmit={handleCreateRoom} className="mt-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Room Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 402B"
                                    value={newRoomNumber}
                                    onChange={(e) => setNewRoomNumber(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={createRoom.isPending}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 neon-glow-primary active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <DoorOpen size={16} />
                                <span>{createRoom.isPending ? 'Syncing...' : 'Provision Room'}</span>
                            </button>
                        </form>
                    </Card>

                    {/* Add Device */}
                    <Card title="Add Peripheral" description="Connect a new load to a specific room.">
                        <form onSubmit={handleAddDevice} className="mt-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Device Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ceiling Fan"
                                    value={newDevice.name}
                                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Room #</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="101"
                                        value={newDevice.roomNumber}
                                        onChange={(e) => setNewDevice({ ...newDevice, roomNumber: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Watts</label>
                                    <input
                                        type="number"
                                        value={newDevice.powerWatts}
                                        onChange={(e) => setNewDevice({ ...newDevice, powerWatts: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={addDevice.isPending}
                                className="w-full bg-accent/20 border border-accent/20 hover:bg-accent/30 text-accent font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                <Zap size={16} />
                                <span>{addDevice.isPending ? 'Deploying...' : 'Add Device'}</span>
                            </button>
                        </form>
                    </Card>

                    <div className="p-5 glass-panel rounded-2xl bg-danger/5 border border-danger/10">
                        <div className="flex items-center space-x-3 text-danger mb-2">
                            <AlertTriangle size={18} />
                            <h4 className="font-bold text-sm tracking-tight">Warning Area</h4>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                            Deleting resources will permanently remove all associated energy logs and historical analytic signatures. This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
