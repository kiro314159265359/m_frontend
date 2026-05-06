"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { folioApi } from "@/app/lib/api";
import { Badge, statusVariant } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { useToast } from "@/app/components/ui/Toast";
import type { Folio } from "@/app/types";

export default function FolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = Number(params.guestId);
  const toast = useToast();

  const [folio, setFolio] = useState<Folio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    folioApi.getByGuest(guestId)
      .then((f) => { setFolio(f); setPaid(f.isPaid); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [guestId]);

  async function handlePay() {
    if (!folio) return;
    setPaying(true);
    try {
      await folioApi.confirmPayment(folio.id);
      setPaid(true);
      toast.success("Payment confirmed — guest checked out.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally { setPaying(false); }
  }

  if (loading) return <div className="flex items-center justify-center h-60"><div className="animate-spin rounded-full h-7 w-7 border-2 border-brand-600 border-t-transparent" /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">{error}</div>;
  if (!folio) return <div className="py-16 text-center text-sm text-gray-400">No folio found for this guest.</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <button onClick={() => router.push("/folio")} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to search
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Folio #{folio.id}</h1>
          <p className="text-sm text-gray-500 mt-1">{folio.guestName} &bull; Room {folio.roomNumber}</p>
        </div>
        {paid && (
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-lg ring-1 ring-emerald-600/20 text-sm font-bold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            PAID
          </div>
        )}
      </div>

      {/* Charges table */}
      <div className="premium-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-[15px] font-semibold text-gray-900">Charges</p>
        </div>
        {folio.lines.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No charges yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {folio.lines.map((line) => (
                <tr key={line.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-3"><Badge label={line.lineType} variant={statusVariant(line.lineType)} /></td>
                  <td className="px-6 py-3 text-gray-700">{line.description}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">${line.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Due</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">${folio.total.toFixed(2)}</p>
          </div>
          {!paid && (
            <Button onClick={handlePay} loading={paying} className="h-11 px-6">
              Confirm Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
