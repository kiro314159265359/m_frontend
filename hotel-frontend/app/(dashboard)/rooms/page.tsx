"use client";

import { useEffect, useState } from "react";
import { roomsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import type { Room } from "@/app/types";

const statusColor: Record<string, string> = {
  Available: "bg-emerald-500",
  Occupied:  "bg-sky-500",
  Dirty:     "bg-amber-500",
  Maintenance: "bg-rose-500",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { roomsApi.getAll().then(setRooms).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center h-60"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rooms</h1>
        <p className="text-sm text-gray-500 mt-1">All rooms and their current status.</p>
      </div>
      {rooms.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">No rooms found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="premium-card p-5 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-[3px] ${statusColor[room.status] ?? 'bg-gray-300'}`} />
              <div className="flex items-start justify-between mb-4 mt-1">
                <span className="text-xl font-bold text-gray-900">{room.roomNumber}</span>
                <Badge label={room.status} variant={statusVariant(room.status)} />
              </div>
              <p className="text-sm text-gray-500 mb-1">{room.type}</p>
              <p className="text-lg font-bold text-gray-900">${room.pricePerNight}<span className="text-xs font-normal text-gray-400">/night</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
