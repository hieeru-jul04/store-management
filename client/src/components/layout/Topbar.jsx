import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Mở menu"
        >
          ☰
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-slate-900 lg:hidden">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
          <p className="text-xs text-slate-500">{user?.username}</p>
        </span>
        <Button variant="secondary" size="md" className="!w-auto" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>
    </header>
  )
}
