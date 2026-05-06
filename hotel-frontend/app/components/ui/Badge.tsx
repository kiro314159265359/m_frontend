type BadgeVariant =
  | "available"
  | "occupied"
  | "dirty"
  | "maintenance"
  | "pending"
  | "checkedin"
  | "checkedout"
  | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  available:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  occupied:    "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
  dirty:       "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  maintenance: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20",
  pending:     "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  checkedin:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  checkedout:  "bg-gray-100 text-gray-600 ring-1 ring-gray-400/20",
  default:     "bg-gray-100 text-gray-600 ring-1 ring-gray-400/20",
};

export function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

export function statusVariant(status: string): BadgeVariant {
  return (status.toLowerCase().replace("-", "") as BadgeVariant) ?? "default";
}