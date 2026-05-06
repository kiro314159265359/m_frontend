"use client";

import { useEffect, useState, FormEvent } from "react";
import { inventoryApi } from "@/app/lib/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Spinner, EmptyState, ErrorBox } from "@/app/components/ui/States";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/app/components/ui/Table";
import { useToast } from "@/app/components/ui/Toast";
import type { InventoryItem } from "@/app/types";

export default function InventoryPage() {
  const toast = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ roomId: "", itemId: "", quantity: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => { 
    setLoading(true); 
    inventoryApi.getAll()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false)); 
  };
  useEffect(() => { load(); }, []);

  async function handleUse(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await inventoryApi.use({ 
        roomId: Number(form.roomId), 
        itemId: Number(form.itemId), 
        quantity: Number(form.quantity) 
      });
      toast.success("Item usage logged successfully!");
      setForm({ roomId: "", itemId: "", quantity: "" });
      load();
    } catch (err: unknown) { 
      setFormError(err instanceof Error ? err.message : "Failed to log usage."); 
    } finally { 
      setFormLoading(false); 
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorBox title="Failed to load inventory" message={error} />;

  const lowStock = items.filter(i => i.quantity < 10).length;
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
        <p className="text-sm text-gray-500 mt-2">Track stock levels and log item consumption.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="premium-card p-6">
          <p className="text-sm text-gray-600 mb-2">Total Items</p>
          <p className="text-4xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="premium-card p-6">
          <p className="text-sm text-gray-600 mb-2">Total Units</p>
          <p className="text-4xl font-bold text-brand-600">{totalStock}</p>
        </div>
        <div className="premium-card p-6 border-l-4 border-rose-500">
          <p className="text-sm text-gray-600 mb-2">Low Stock Items</p>
          <p className="text-4xl font-bold text-rose-600">{lowStock}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Stock Table */}
        <div className="lg:col-span-2 premium-card overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Stock Levels</h2>
          </div>
          {items.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              title="No Inventory Items"
              description="No items have been added to inventory yet."
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow hoverable={false}>
                  <TableHeaderCell>Item Name</TableHeaderCell>
                  <TableHeaderCell align="right">Quantity</TableHeaderCell>
                  <TableHeaderCell align="right">Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  let statusColor = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
                  let statusLabel = 'Adequate';
                  if (item.quantity < 10) {
                    statusColor = 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
                    statusLabel = 'Critical';
                  } else if (item.quantity < 30) {
                    statusColor = 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
                    statusLabel = 'Low';
                  }
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell align="right" className="font-semibold">{item.quantity} units</TableCell>
                      <TableCell align="right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Usage Form */}
        <div className="premium-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Log Usage</h3>
          </div>
          <form onSubmit={handleUse} className="flex flex-col gap-4">
            <Input 
              label="Room ID" 
              type="number" 
              placeholder="Enter room number..." 
              value={form.roomId} 
              onChange={(e) => { setFormError(""); setForm({ ...form, roomId: e.target.value }); }} 
              required 
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Item</label>
              <select 
                className="styled-select" 
                value={form.itemId} 
                onChange={(e) => { setFormError(""); setForm({ ...form, itemId: e.target.value }); }} 
                required
              >
                <option value="" disabled>Select an item...</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id} disabled={i.quantity === 0}>
                    {i.name} ({i.quantity} available)
                  </option>
                ))}
              </select>
            </div>
            
            <Input 
              label="Quantity Used" 
              type="number" 
              min="1" 
              placeholder="Enter quantity..." 
              value={form.quantity} 
              onChange={(e) => { setFormError(""); setForm({ ...form, quantity: e.target.value }); }} 
              required 
            />
            
            {formError && <ErrorBox title="Error" message={formError} />}
            
            <Button 
              type="submit" 
              loading={formLoading} 
              fullWidth 
              variant="primary"
            >
              Log Usage
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
