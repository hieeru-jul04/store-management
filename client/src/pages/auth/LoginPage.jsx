import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  function validate() {
    const next = {}
    if (!form.username.trim()) next.username = 'Vui lòng nhập tên đăng nhập'
    if (!form.password) next.password = 'Vui lòng nhập mật khẩu'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    try {
      await login({
        username: form.username.trim(),
        password: form.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.'
      setApiError(message)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>
        <p className="mt-1 text-sm text-slate-500">
          Chào mừng trở lại! Đăng nhập để quản lý cửa hàng của bạn.
        </p>
      </div>

      {apiError && <Alert className="mb-4">{apiError}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="username"
          name="username"
          label="Tên đăng nhập"
          placeholder="username_cua_ban"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button type="submit" loading={loading} className="mt-2">
          Đăng nhập
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Đăng ký cửa hàng
        </Link>
      </p>
    </div>
  )
}
