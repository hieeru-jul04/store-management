export function StatCard({ label, value, icon, trend, variant = 'default' }) {
  const variants = {
    default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50',
  }

  return (
    <article
      className={`flex items-start justify-between rounded-2xl border p-5 shadow-sm transition-colors ${variants[variant] ?? variants.default}`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
        {trend && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{trend}</p>}
      </div>
      {icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-xl">
          {icon}
        </span>
      )}
    </article>
  )
}
