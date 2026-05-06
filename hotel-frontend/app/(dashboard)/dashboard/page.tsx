"use client";

import { useEffect, useState } from "react";
import { roomsApi, reservationsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import type { Room, Reservation } from "@/app/types";

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([roomsApi.getAll(), reservationsApi.getActive()])
      .then(([r, res]) => { setRooms(r); setReservations(res); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  const stats = [
    { label: "Total Rooms",  value: rooms.length, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", accent: "bg-slate-100 text-slate-600" },
    { label: "Available",    value: rooms.filter(r => r.status === "Available").length, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", accent: "bg-emerald-50 text-emerald-600" },
    { label: "Occupied",     value: rooms.filter(r => r.status === "Occupied").length,  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", accent: "bg-sky-50 text-sky-600" },
    { label: "Reservations", value: reservations.length, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", accent: "bg-brand-50 text-brand-600" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your hotel operations.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="premium-card p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-xl ${s.accent}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">Active Reservations</h2>
        </div>
        {reservations.length === 0 ? (
          <EmptyState message="No active reservations." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Guest</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-gray-900">{r.guestName}</p>
                      <p className="text-xs text-gray-400">{r.guestPhone}</p>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{r.roomNumber ?? "—"}</td>
                    <td className="px-6 py-3.5"><Badge label={r.status} variant={statusVariant(r.status)} /></td>
                    <td className="px-6 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(r.checkInDate).toLocaleDateString()} → {new Date(r.checkOutDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center h-60"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>;
}
function ErrorBox({ message }: { message: string }) {
  return <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm"><strong>Error:</strong> {message}</div>;
}
function EmptyState({ message }: { message: string }) {
  return <div className="py-12 text-center text-sm text-gray-400">{message}</div>;
}
