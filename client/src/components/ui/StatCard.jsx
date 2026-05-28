export function StatCard({ label, value, icon, trend, variant = 'default' }) {
  const variants = {
    default: 'bg-white border-slate-200',
    warning: 'bg-amber-50 border-amber-200',
    success: 'bg-emerald-50 border-emerald-200',
  }

  return (
    <article
      className={`flex items-start justify-between rounded-2xl border p-5 shadow-sm ${variants[variant] ?? variants.default}`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
      </div>
      {icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl">
          {icon}
        </span>
      )}
    </article>
  )
}
