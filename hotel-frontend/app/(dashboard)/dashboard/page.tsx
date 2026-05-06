"use client";

import { useEffect, useState } from "react";
import { roomsApi, reservationsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Spinner, EmptyState, ErrorBox } from "@/app/components/ui/States";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/app/components/ui/Table";
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
  if (error) return <ErrorBox title="Failed to load dashboard" message={error} />;

  const stats = [
    { 
      label: "Total Rooms", 
      value: rooms.length, 
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      accent: "bg-slate-100 text-slate-700",
      trend: "+0 this month"
    },
    { 
      label: "Available", 
      value: rooms.filter(r => r.status === "Available").length, 
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      accent: "bg-emerald-100 text-emerald-700",
      trend: "Ready to book"
    },
    { 
      label: "Occupied", 
      value: rooms.filter(r => r.status === "Occupied").length, 
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      accent: "bg-sky-100 text-sky-700",
      trend: "Currently in use"
    },
    { 
      label: "Reservations", 
      value: reservations.length, 
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      accent: "bg-brand-50 text-brand-700",
      trend: "Active bookings"
    },
  ];

  const availableRoomStats = [
    { type: "Single", count: rooms.filter(r => r.type === "Single" && r.status === "Available").length },
    { type: "Double", count: rooms.filter(r => r.type === "Double" && r.status === "Available").length },
    { type: "Suite", count: rooms.filter(r => r.type === "Suite" && r.status === "Available").length },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2">Welcome back! Here's your hotel overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {stats.map((s) => (
          <div key={s.label} className="premium-card p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${s.accent}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-500">{s.trend}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Types Available */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {availableRoomStats.map((stat) => (
          <div key={stat.type} className="premium-card p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">{stat.type} Rooms Available</p>
            <p className="text-4xl font-bold text-brand-600">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Active Reservations Table */}
      <div className="premium-card overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Active Reservations</h2>
              <p className="text-sm text-gray-500 mt-1">{reservations.length} ongoing bookings</p>
            </div>
          </div>
        </div>
        {reservations.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="No Active Reservations"
            description="All reservations are up to date or checked out."
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow hoverable={false}>
                <TableHeaderCell>Guest</TableHeaderCell>
                <TableHeaderCell>Room</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Duration</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.slice(0, 5).map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900">{r.guestName}</p>
                      <p className="text-xs text-gray-400">{r.guestPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{r.roomNumber ?? "—"}</TableCell>
                  <TableCell>
                    <Badge label={r.status} variant={statusVariant(r.status)} />
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(r.checkInDate).toLocaleDateString()} → {new Date(r.checkOutDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
