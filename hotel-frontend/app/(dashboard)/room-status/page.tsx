"use client";

import { useEffect, useState } from "react";
import { roomsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { useToast } from "@/app/components/ui/Toast";
import type { Room } from "@/app/types";

const VALID_TRANSITIONS: Record<string, string[]> = {
  Available: ["Maintenance"], Occupied: [], Dirty: ["Available", "Maintenance"], Maintenance: ["Available"],
};

export default function RoomStatusPage() {
  const toast = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [updating, setUpdating] = useState<number | null>(null);

  const load = () => { setLoading(true); roomsApi.getAll().then(setRooms).catch((e) => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleUpdate(room: Room) {
    const newStatus = selected[room.id];
    if (!newStatus) return;
    setUpdating(room.id);
    try {
      await roomsApi.updateStatus(room.id, newStatus);
      toast.success(`Room ${room.roomNumber} → ${newStatus}`);
      setSelected((p) => { const c = { ...p }; delete c[room.id]; return c; });
      load();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed."); }
    finally { setUpdating(null); }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Room Status</h1>
        <p className="text-sm text-gray-500 mt-1">Update room statuses after cleaning or maintenance.</p>
      </div>
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Change To</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rooms.map((room) => {
                  const t = VALID_TRANSITIONS[room.status] ?? [];
                  return (
                    <tr key={room.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-gray-900">{room.roomNumber}</td>
                      <td className="px-6 py-3.5 text-gray-600">{room.type}</td>
                      <td className="px-6 py-3.5"><Badge label={room.status} variant={statusVariant(room.status)} /></td>
                      <td className="px-6 py-3.5">
                        {t.length > 0 ? (
                          <select className="styled-select w-36" value={selected[room.id] ?? ""} onChange={(e) => setSelected((p) => ({ ...p, [room.id]: e.target.value }))}>
                            <option value="" disabled>Select...</option>
                            {t.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : <span className="text-xs text-gray-400 italic">—</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        {t.length > 0 && <Button variant="secondary" disabled={!selected[room.id]} loading={updating === room.id} onClick={() => handleUpdate(room)}>Update</Button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
