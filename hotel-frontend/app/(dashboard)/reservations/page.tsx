"use client";

import { useEffect, useState } from "react";
import { reservationsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Modal, ModalFooter } from "@/app/components/ui/Modal";
import { Spinner, EmptyState, ErrorBox } from "@/app/components/ui/States";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/app/components/ui/Table";
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
      setFormError(err instanceof Error ? err.message : "Failed to create reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorBox title="Failed to load reservations" message={error} />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reservations</h1>
          <p className="text-sm text-gray-500 mt-2">Manage guest reservations and bookings.</p>
        </div>
        <Button onClick={() => setShowForm(true)} variant="primary" size="md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Phone Booking
        </Button>
      </div>

      {/* New Phone Booking Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setFormError(""); }}
        title="New Phone Booking"
        subtitle="Create a reservation for a guest."
        size="md"
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowForm(false); setFormError(""); }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={handlePhoneBooking}
              disabled={!form.guestFullName || !form.guestPhone || !form.checkInDate || !form.checkOutDate}
            >
              Create Reservation
            </Button>
          </ModalFooter>
        }
      >
        <form onSubmit={handlePhoneBooking} className="space-y-5">
          <Input
            label="Guest Name"
            placeholder="John Doe"
            value={form.guestFullName}
            onChange={(e) => { setFormError(""); setForm({ ...form, guestFullName: e.target.value }); }}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={form.guestPhone}
            onChange={(e) => { setFormError(""); setForm({ ...form, guestPhone: e.target.value }); }}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check-in Date"
              type="date"
              value={form.checkInDate}
              onChange={(e) => { setFormError(""); setForm({ ...form, checkInDate: e.target.value }); }}
              required
            />
            <Input
              label="Check-out Date"
              type="date"
              value={form.checkOutDate}
              onChange={(e) => { setFormError(""); setForm({ ...form, checkOutDate: e.target.value }); }}
              required
            />
          </div>
          {formError && <ErrorBox title="Error" message={formError} />}
        </form>
      </Modal>

      {/* Reservations Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="premium-card p-4 text-center">
          <p className="text-3xl font-bold text-brand-600">{reservations.length}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Total Reservations</p>
        </div>
        <div className="premium-card p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{reservations.filter(r => r.status === "CheckedIn").length}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Checked In</p>
        </div>
        <div className="premium-card p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{reservations.filter(r => r.status === "Pending").length}</p>
          <p className="text-xs font-medium text-gray-600 mt-1">Pending</p>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="premium-card overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Reservations</h2>
        </div>
        {reservations.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="No Reservations Yet"
            description="Start by creating a phone booking."
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow hoverable={false}>
                <TableHeaderCell>Guest</TableHeaderCell>
                <TableHeaderCell>Room</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Source</TableHeaderCell>
                <TableHeaderCell>Duration</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {r.guestName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{r.guestName}</p>
                        <p className="text-xs text-gray-500">{r.guestPhone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {r.roomNumber ? (
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-sm font-semibold">{r.roomNumber}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge label={r.status} variant={statusVariant(r.status)} />
                  </TableCell>
                  <TableCell>
                    <Badge label={r.source} variant={r.source === "Phone" ? "available" : "occupied"} />
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 whitespace-nowrap">
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
