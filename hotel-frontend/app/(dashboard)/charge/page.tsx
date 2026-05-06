"use client";

import { useState, FormEvent } from "react";
import { restaurantApi } from "@/app/lib/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useToast } from "@/app/components/ui/Toast";

export default function ChargePage() {
  const toast = useToast();
  const [form, setForm] = useState({ guestId: "", description: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await restaurantApi.addCharge({ guestId: Number(form.guestId), description: form.description, amount: Number(form.amount) });
      toast.success("Charge posted to guest folio.");
      setForm({ guestId: "", description: "", amount: "" });
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed."); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 mb-6">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Post a Charge</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Bill a service charge to a guest room folio.</p>
      <form onSubmit={handleSubmit} className="premium-card p-6 w-full max-w-sm space-y-4">
        <Input label="Guest ID" type="number" placeholder="e.g. 1" value={form.guestId} onChange={(e) => { setError(""); setForm({ ...form, guestId: e.target.value }); }} required autoFocus />
        <Input label="Description" placeholder="e.g. Dinner buffet" value={form.description} onChange={(e) => { setError(""); setForm({ ...form, description: e.target.value }); }} required />
        <Input label="Amount ($)" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={(e) => { setError(""); setForm({ ...form, amount: e.target.value }); }} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">Post Charge</Button>
      </form>
    </div>
  );
}
