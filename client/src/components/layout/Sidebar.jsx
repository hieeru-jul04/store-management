import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar({ onNavigate }) {
  const { user } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
            🏪
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">StoreManager</p>
            <p className="truncate text-xs text-slate-500">{user?.shopName}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
