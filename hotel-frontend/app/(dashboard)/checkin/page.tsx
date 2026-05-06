"use client";

import { useEffect, useState, FormEvent } from "react";
import { reservationsApi, roomsApi } from "@/app/lib/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useToast } from "@/app/components/ui/Toast";
import type { Room } from "@/app/types";

export default function CheckInPage() {
  const toast = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [walkIn, setWalkIn] = useState({ guestFullName: "", guestPhone: "", nationalId: "", roomId: "", checkOutDate: "" });
  const [walkInLoading, setWalkInLoading] = useState(false);
  const [walkInError, setWalkInError] = useState("");

  const [convert, setConvert] = useState({ existingReservationId: "", guestFullName: "", guestPhone: "", roomId: "", checkOutDate: "" });
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState("");

  useEffect(() => {
    roomsApi.getAll().then(setRooms).catch(() => {}).finally(() => setLoadingRooms(false));
  }, []);

  const availableRooms = rooms.filter((r) => r.status === "Available");

  async function handleWalkIn(e: FormEvent) {
    e.preventDefault();
    setWalkInError("");
    setWalkInLoading(true);
    try {
      const res = await reservationsApi.checkIn({
        guestFullName: walkIn.guestFullName, guestPhone: walkIn.guestPhone,
        nationalId: walkIn.nationalId || undefined, roomId: Number(walkIn.roomId), checkOutDate: walkIn.checkOutDate,
      });
      toast.success(`${res.guestName} checked in!`);
      setWalkIn({ guestFullName: "", guestPhone: "", nationalId: "", roomId: "", checkOutDate: "" });
      roomsApi.getAll().then(setRooms);
    } catch (err: unknown) { setWalkInError(err instanceof Error ? err.message : "Failed."); }
    finally { setWalkInLoading(false); }
  }

  async function handleConvert(e: FormEvent) {
    e.preventDefault();
    setConvertError("");
    setConvertLoading(true);
    try {
      const res = await reservationsApi.checkIn({
        guestFullName: convert.guestFullName, guestPhone: convert.guestPhone,
        roomId: Number(convert.roomId), checkOutDate: convert.checkOutDate,
        existingReservationId: Number(convert.existingReservationId),
      });
      toast.success(`${res.guestName} checked in from reservation #${convert.existingReservationId}!`);
      setConvert({ existingReservationId: "", guestFullName: "", guestPhone: "", roomId: "", checkOutDate: "" });
      roomsApi.getAll().then(setRooms);
    } catch (err: unknown) { setConvertError(err instanceof Error ? err.message : "Failed."); }
    finally { setConvertLoading(false); }
  }

  if (loadingRooms) return <div className="flex items-center justify-center h-60"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Check-in</h1>
        <p className="text-sm text-gray-500 mt-1">Register walk-in guests or convert phone bookings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Walk-in */}
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900">Walk-in Guest</h2>
          </div>
          <form onSubmit={handleWalkIn} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="John Doe" value={walkIn.guestFullName} onChange={(e) => { setWalkInError(""); setWalkIn({ ...walkIn, guestFullName: e.target.value }); }} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Phone" type="tel" placeholder="+123456789" value={walkIn.guestPhone} onChange={(e) => { setWalkInError(""); setWalkIn({ ...walkIn, guestPhone: e.target.value }); }} required />
              <Input label="National ID" placeholder="Optional" value={walkIn.nationalId} onChange={(e) => { setWalkInError(""); setWalkIn({ ...walkIn, nationalId: e.target.value }); }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-gray-700">Room</label>
              <select className="styled-select" value={walkIn.roomId} onChange={(e) => { setWalkInError(""); setWalkIn({ ...walkIn, roomId: e.target.value }); }} required>
                <option value="" disabled>Select room...</option>
                {availableRooms.map((r) => <option key={r.id} value={r.id}>Room {r.roomNumber} — {r.type} (${r.pricePerNight})</option>)}
              </select>
              {availableRooms.length === 0 && <span className="text-xs text-amber-600">No rooms available</span>}
            </div>
            <Input label="Check-out Date" type="date" value={walkIn.checkOutDate} onChange={(e) => { setWalkInError(""); setWalkIn({ ...walkIn, checkOutDate: e.target.value }); }} required />
            {walkInError && <p className="text-sm text-red-600">{walkInError}</p>}
            <Button type="submit" loading={walkInLoading}>Check In</Button>
          </form>
        </div>

        {/* Convert booking */}
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900">Convert Phone Booking</h2>
          </div>
          <form onSubmit={handleConvert} className="flex flex-col gap-4">
            <Input label="Reservation ID" type="number" placeholder="e.g. 42" value={convert.existingReservationId} onChange={(e) => { setConvertError(""); setConvert({ ...convert, existingReservationId: e.target.value }); }} required />
            <Input label="Guest Name" placeholder="Jane Smith" value={convert.guestFullName} onChange={(e) => { setConvertError(""); setConvert({ ...convert, guestFullName: e.target.value }); }} required />
            <Input label="Phone" type="tel" placeholder="+123456789" value={convert.guestPhone} onChange={(e) => { setConvertError(""); setConvert({ ...convert, guestPhone: e.target.value }); }} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-gray-700">Room</label>
              <select className="styled-select" value={convert.roomId} onChange={(e) => { setConvertError(""); setConvert({ ...convert, roomId: e.target.value }); }} required>
                <option value="" disabled>Select room...</option>
                {availableRooms.map((r) => <option key={r.id} value={r.id}>Room {r.roomNumber} — {r.type} (${r.pricePerNight})</option>)}
              </select>
            </div>
            <Input label="Check-out Date" type="date" value={convert.checkOutDate} onChange={(e) => { setConvertError(""); setConvert({ ...convert, checkOutDate: e.target.value }); }} required />
            {convertError && <p className="text-sm text-red-600">{convertError}</p>}
            <Button type="submit" loading={convertLoading}>Process Booking</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
