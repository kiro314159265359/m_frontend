"use client";

import { useEffect, useState } from "react";
import { roomsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Spinner, EmptyState, ErrorBox } from "@/app/components/ui/States";
import type { Room } from "@/app/types";

const statusColor: Record<string, string> = {
  Available: "bg-emerald-500",
  Occupied: "bg-sky-500",
  Dirty: "bg-amber-500",
  Maintenance: "bg-rose-500",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    roomsApi.getAll()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredRooms = rooms.filter(r =>
    r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorBox title="Failed to load rooms" message={error} />;

  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "Available").length,
    occupied: rooms.filter(r => r.status === "Occupied").length,
    maintenance: rooms.filter(r => r.status === "Maintenance").length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rooms</h1>
          <p className="text-sm text-gray-500 mt-2">Manage all rooms and their status.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="premium-card p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{roomStats.total}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Total Rooms</p>
        </div>
        <div className="premium-card p-4 text-center border-l-4 border-emerald-500">
          <p className="text-3xl font-bold text-emerald-600">{roomStats.available}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Available</p>
        </div>
        <div className="premium-card p-4 text-center border-l-4 border-sky-500">
          <p className="text-3xl font-bold text-sky-600">{roomStats.occupied}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Occupied</p>
        </div>
        <div className="premium-card p-4 text-center border-l-4 border-rose-500">
          <p className="text-3xl font-bold text-rose-600">{roomStats.maintenance}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Maintenance</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search by room number or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          title="No Rooms Found"
          description="Try adjusting your search filters."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredRooms.map((room) => (
            <div key={room.id} className="premium-card p-5 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className={`absolute top-0 left-0 w-full h-1 ${statusColor[room.status] ?? 'bg-gray-300'}`} />
              
              <div className="flex items-start justify-between mb-4 mt-1">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{room.roomNumber}</span>
                  <p className="text-xs text-gray-500 font-medium">{room.type}</p>
                </div>
                <Badge label={room.status} variant={statusVariant(room.status)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Rate</span>
                  <span className="font-bold text-gray-900">${room.pricePerNight}</span>
                </div>
                <div className="h-0.5 bg-gray-100 rounded-full" />
                <p className="text-xs text-gray-400 text-center py-2">
                  {room.status === "Available" ? "Ready to book" : room.status.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
