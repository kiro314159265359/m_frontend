"use client";

import { useEffect, useState, FormEvent } from "react";
import { inventoryApi } from "@/app/lib/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
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

  const load = () => { setLoading(true); inventoryApi.getAll().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleUse(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await inventoryApi.use({ roomId: Number(form.roomId), itemId: Number(form.itemId), quantity: Number(form.quantity) });
      toast.success("Usage logged.");
      setForm({ roomId: "", itemId: "", quantity: "" });
      load();
    } catch (err: unknown) { setFormError(err instanceof Error ? err.message : "Failed."); }
    finally { setFormLoading(false); }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h1>
        <p className="text-sm text-gray-500 mt-1">Stock levels and consumption tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 premium-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><p className="text-[15px] font-semibold text-gray-900">Current Stock</p></div>
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No items found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr><th className="px-6 py-3">Item</th><th className="px-6 py-3 text-right">Available</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        item.quantity < 10 ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20' :
                        item.quantity < 30 ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' :
                        'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                      }`}>{item.quantity} units</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-900">Record Usage</p>
          </div>
          <form onSubmit={handleUse} className="flex flex-col gap-4">
            <Input label="Room ID" type="number" placeholder="e.g. 1" value={form.roomId} onChange={(e) => { setFormError(""); setForm({ ...form, roomId: e.target.value }); }} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-gray-700">Item</label>
              <select className="styled-select" value={form.itemId} onChange={(e) => { setFormError(""); setForm({ ...form, itemId: e.target.value }); }} required>
                <option value="" disabled>Select item...</option>
                {items.map((i) => <option key={i.id} value={i.id} disabled={i.quantity === 0}>{i.name} ({i.quantity})</option>)}
              </select>
            </div>
            <Input label="Quantity" type="number" min="1" placeholder="e.g. 2" value={form.quantity} onChange={(e) => { setFormError(""); setForm({ ...form, quantity: e.target.value }); }} required />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <Button type="submit" loading={formLoading}>Log Usage</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
