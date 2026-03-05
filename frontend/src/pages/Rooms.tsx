import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import { RoomCard } from '../components/rooms/RoomCard';
import { Loader } from '../components/ui/Loader';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Rooms: React.FC = () => {
    const { data: rooms, isLoading } = useRooms();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'All' | 'Occupied' | 'Idle' | 'Sleeping'>('All');

    if (isLoading) return <Loader fullPage />;

    const filteredRooms = rooms?.filter(room => {
        const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || room.occupancyStatus === filter;
        return matchesSearch && matchesFilter;
    }) || [];

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white italic">INVENTORY <span className="text-primary not-italic">ROOMS</span></h1>
                    <p className="text-white/40 font-medium mt-1">Manage and monitor all connected living spaces.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-all transform active:scale-[0.98] neon-glow-primary">
                    <Plus size={18} />
                    <span>Onboard New Room</span>
                </button>
            </header>

            <div className="glass-panel p-2 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-all h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-[1.5rem] border border-white/5">
                    {['All', 'Occupied', 'Idle', 'Sleeping'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-6 py-2.5 rounded-[1.2rem] text-xs font-bold transition-all relative
                            ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                        >
                            {f}
                            {filter === f && (
                                <motion.div layoutId="room-filter" className="absolute inset-0 bg-primary rounded-[1.2rem] -z-10" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {filteredRooms.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Search size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/40 font-medium">No rooms match your current search context.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                        <RoomCard key={room._id} room={room} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rooms;
