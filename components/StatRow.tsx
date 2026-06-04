interface StatRowProps {
  label: string;
  value: string;
  variant?: "default" | "highlight" | "muted";
}

const variantStyles = {
  default: "text-slate-900",
  highlight: "text-brand-700 font-semibold",
  muted: "text-slate-500",
};

export function StatRow({ label, value, variant = "default" }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm tabular-nums ${variantStyles[variant]}`}>
        {value}
      </span>
    </div>
  );
}
