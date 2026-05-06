"use client";

import { useEffect, useState } from "react";
import { roomsApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Spinner, EmptyState, ErrorBox } from "@/app/components/ui/States";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/app/components/ui/Table";
import { useToast } from "@/app/components/ui/Toast";
import type { Room } from "@/app/types";

const VALID_TRANSITIONS: Record<string, string[]> = {
  Available: ["Maintenance"], 
  Occupied: [], 
  Dirty: ["Available", "Maintenance"], 
  Maintenance: ["Available"],
};

export default function RoomStatusPage() {
  const toast = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [updating, setUpdating] = useState<number | null>(null);

  const load = () => { 
    setLoading(true); 
    roomsApi.getAll()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false)); 
  };
  useEffect(() => { load(); }, []);

  async function handleUpdate(room: Room) {
    const newStatus = selected[room.id];
    if (!newStatus) return;
    setUpdating(room.id);
    try {
      await roomsApi.updateStatus(room.id, newStatus);
      toast.success(`Room ${room.roomNumber} updated to ${newStatus}`);
      setSelected((p) => { const c = { ...p }; delete c[room.id]; return c; });
      load();
    } catch (err: unknown) { 
      toast.error(err instanceof Error ? err.message : "Failed to update room status"); 
    } finally { 
      setUpdating(null); 
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorBox title="Failed to load rooms" message={error} />;

  const statusGroups = {
    dirty: rooms.filter(r => r.status === "Dirty").length,
    maintenance: rooms.filter(r => r.status === "Maintenance").length,
    available: rooms.filter(r => r.status === "Available").length,
  };

  const updatableRooms = rooms.filter(r => VALID_TRANSITIONS[r.status]?.length > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Room Status</h1>
        <p className="text-sm text-gray-500 mt-2">Update room statuses after cleaning or maintenance.</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="premium-card p-6 border-l-4 border-amber-500">
          <p className="text-sm text-gray-600 mb-2">Rooms Needing Cleaning</p>
          <p className="text-4xl font-bold text-amber-600">{statusGroups.dirty}</p>
        </div>
        <div className="premium-card p-6 border-l-4 border-rose-500">
          <p className="text-sm text-gray-600 mb-2">In Maintenance</p>
          <p className="text-4xl font-bold text-rose-600">{statusGroups.maintenance}</p>
        </div>
        <div className="premium-card p-6 border-l-4 border-emerald-500">
          <p className="text-sm text-gray-600 mb-2">Available</p>
          <p className="text-4xl font-bold text-emerald-600">{statusGroups.available}</p>
        </div>
      </div>

      {/* Room Status Table */}
      <div className="premium-card overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Update Room Status
            {updatableRooms.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({updatableRooms.length} rooms can be updated)</span>}
          </h2>
        </div>
        {updatableRooms.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="No Rooms to Update"
            description="All rooms are in a state where no updates are available."
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow hoverable={false}>
                <TableHeaderCell>Room</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Current Status</TableHeaderCell>
                <TableHeaderCell>Change To</TableHeaderCell>
                <TableHeaderCell align="right">Action</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatableRooms.map((room) => {
                const transitions = VALID_TRANSITIONS[room.status] ?? [];
                return (
                  <TableRow key={room.id}>
                    <TableCell className="font-bold">{room.roomNumber}</TableCell>
                    <TableCell className="text-sm text-gray-600">{room.type}</TableCell>
                    <TableCell>
                      <Badge label={room.status} variant={statusVariant(room.status)} />
                    </TableCell>
                    <TableCell>
                      {transitions.length > 0 ? (
                        <select 
                          className="styled-select w-36" 
                          value={selected[room.id] ?? ""} 
                          onChange={(e) => setSelected((p) => ({ ...p, [room.id]: e.target.value }))}
                        >
                          <option value="" disabled>Select status...</option>
                          {transitions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-400 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {transitions.length > 0 && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          disabled={!selected[room.id]} 
                          loading={updating === room.id} 
                          onClick={() => handleUpdate(room)}
                        >
                          Update
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
