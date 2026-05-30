export function Input({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full rounded-xl border bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 shadow-sm transition-colors',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          error ? 'border-red-300 dark:border-red-500/50' : 'border-slate-200 dark:border-slate-700',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
