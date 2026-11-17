export default function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="shrink-0 text-xs font-extrabold uppercase tracking-wide text-white/50">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-bold break-words text-white">{children}</dd>
    </div>
  );
}
