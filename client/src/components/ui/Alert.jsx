export function Alert({ type = 'error', className = '', children }) {
  const styles = {
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  }

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${styles[type]} ${className}`}
    >
      {children}
    </div>
  )
}
