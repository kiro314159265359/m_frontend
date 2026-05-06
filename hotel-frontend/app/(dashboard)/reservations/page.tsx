"use client";

import { useEffect, useState } from "react";
import { reservationsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import type { Reservation } from "@/app/types";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ guestFullName: "", guestPhone: "", checkInDate: "", checkOutDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setLoading(true);
    reservationsApi.getActive()
      .then(setReservations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  async function handlePhoneBooking(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await reservationsApi.phoneBooking(form);
      setForm({ guestFullName: "", guestPhone: "", checkInDate: "", checkOutDate: "" });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reservations</h1>
          <p className="text-sm text-gray-500 mt-1">Active and pending guest reservations.</p>
        </div>
        <Button onClick={() => setShowForm(v => !v)} variant={showForm ? "secondary" : "primary"}>
          {showForm ? "Cancel" : "+ Phone Booking"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handlePhoneBooking} className="premium-card p-6 animate-slide-up">
          <p className="text-[15px] font-semibold text-gray-900 mb-4">New Phone Booking</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input label="Guest Name" placeholder="John Doe" value={form.guestFullName} onChange={(e) => { setFormError(""); setForm({ ...form, guestFullName: e.target.value }); }} required />
            <Input label="Phone" type="tel" placeholder="+123456789" value={form.guestPhone} onChange={(e) => { setFormError(""); setForm({ ...form, guestPhone: e.target.value }); }} required />
            <Input label="Check-in" type="date" value={form.checkInDate} onChange={(e) => { setFormError(""); setForm({ ...form, checkInDate: e.target.value }); }} required />
            <Input label="Check-out" type="date" value={form.checkOutDate} onChange={(e) => { setFormError(""); setForm({ ...form, checkOutDate: e.target.value }); }} required />
          </div>
          {formError && <p className="text-sm text-red-600 mb-3">{formError}</p>}
          <div className="flex justify-end"><Button type="submit" loading={submitting}>Create Reservation</Button></div>
        </form>
      )}

      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : reservations.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No active reservations.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Guest</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {r.guestName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{r.guestName}</p>
                          <p className="text-xs text-gray-400">{r.guestPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{r.roomNumber ?? <span className="text-gray-300 italic">—</span>}</td>
                    <td className="px-6 py-3.5"><Badge label={r.status} variant={statusVariant(r.status)} /></td>
                    <td className="px-6 py-3.5"><Badge label={r.source} variant="default" /></td>
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
