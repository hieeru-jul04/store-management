import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from '../../hooks/useAlert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const { showAlert } = useAlert()
  const [form, setForm] = useState({
    fullName: '',
    shopName: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.fullName.trim()) { showAlert('Lỗi', 'Vui lòng nhập họ tên', 'error'); return false }
    if (!form.shopName.trim()) { showAlert('Lỗi', 'Vui lòng nhập tên cửa hàng', 'error'); return false }
    if (!form.username.trim()) {
      showAlert('Lỗi', 'Vui lòng nhập tên đăng nhập', 'error'); return false
    } else if (form.username.length < 3 || form.username.length > 20) {
      showAlert('Lỗi', 'Tên đăng nhập phải từ 3–20 ký tự', 'error'); return false
    }
    if (!form.password) {
      showAlert('Lỗi', 'Vui lòng nhập mật khẩu', 'error'); return false
    } else if (form.password.length < 6) {
      showAlert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự', 'error'); return false
    }
    if (form.password !== form.confirmPassword) {
      showAlert('Lỗi', 'Mật khẩu xác nhận không khớp', 'error'); return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    try {
      await register({
        fullName: form.fullName.trim(),
        shopName: form.shopName.trim(),
        username: form.username.trim(),
        password: form.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đăng ký thất bại. Vui lòng thử lại.'
      showAlert('Lỗi đăng ký', message, 'error')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Đăng ký cửa hàng</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tạo tài khoản miễn phí — mỗi cửa hàng một workspace riêng.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="fullName"
          name="fullName"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={form.fullName}
          onChange={handleChange}
          autoComplete="name"
        />
        <Input
          id="shopName"
          name="shopName"
          label="Tên cửa hàng"
          placeholder="Cửa hàng ABC"
          value={form.shopName}
          onChange={handleChange}
        />
        <Input
          id="username"
          name="username"
          label="Tên đăng nhập"
          placeholder="shop_abc"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Ít nhất 6 ký tự"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} className="mt-2">
          Tạo tài khoản
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
