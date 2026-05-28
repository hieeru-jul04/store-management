import { useEffect, useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { getSettings, updateSettings } from '../../api/shop.api'
import { useAuth } from '../../hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    shopName: '',
    phone: '',
    address: '',
    taxCode: '',
    lowStockThreshold: '10',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setForm({
          shopName: settings.shopName || user?.shopName || '',
          phone: settings.phone || '',
          address: settings.address || '',
          taxCode: settings.taxCode || '',
          lowStockThreshold: String(settings.lowStockThreshold ?? 10),
        })
      })
      .finally(() => setLoading(false))
  }, [user?.shopName])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setMessage({ type: '', text: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings({
        shopName: form.shopName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        taxCode: form.taxCode.trim(),
        lowStockThreshold: Number(form.lowStockThreshold) || 10,
      })
      setMessage({ type: 'success', text: 'Đã lưu cài đặt thành công' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Lưu thất bại' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải...</p>
  }

  return (
    <>
      <PageHeader
        title="Cài đặt"
        description="Thông tin cửa hàng và cấu hình hệ thống"
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Thông tin cửa hàng</h2>
          <div className="space-y-4">
            <Input
              id="shopName"
              name="shopName"
              label="Tên cửa hàng"
              value={form.shopName}
              onChange={handleChange}
            />
            <Input
              id="phone"
              name="phone"
              label="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              id="address"
              name="address"
              label="Địa chỉ"
              value={form.address}
              onChange={handleChange}
            />
            <Input
              id="taxCode"
              name="taxCode"
              label="Mã số thuế (tuỳ chọn)"
              value={form.taxCode}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Kho hàng</h2>
          <Input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min="1"
            label="Ngưỡng cảnh báo hết hàng"
            value={form.lowStockThreshold}
            onChange={handleChange}
          />
          <p className="mt-1 text-xs text-slate-500">
            Sản phẩm có tồn ≤ ngưỡng này sẽ hiển thị cảnh báo trên Tổng quan và Tồn kho
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="mb-2 font-semibold text-slate-900">Tài khoản đăng nhập</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Họ tên</dt>
              <dd className="font-medium">{user?.fullName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tên đăng nhập</dt>
              <dd className="font-medium">{user?.username}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            Đổi mật khẩu sẽ khả dụng khi backend hỗ trợ API cập nhật tài khoản.
          </p>
        </section>

        {message.text && (
          <Alert type={message.type === 'success' ? 'success' : 'error'}>
            {message.text}
          </Alert>
        )}

        <Button type="submit" loading={saving} className="max-w-xs">
          Lưu cài đặt
        </Button>
      </form>
    </>
  )
}
