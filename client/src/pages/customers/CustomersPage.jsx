import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { ConfirmModal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { SearchInput } from '../../components/ui/SearchInput'
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '../../api/customer.api'
import { formatDateShort } from '../../utils/format'

const emptyForm = { name: '', phone: '', email: '', address: '', note: '' }

export function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)),
    )
  }, [customers, search])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEdit(customer) {
    setEditing(customer)
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      note: customer.note || '',
    })
    setError('')
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Họ tên và số điện thoại là bắt buộc')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
      }
      if (editing) {
        await updateCustomer(editing.id, payload)
      } else {
        await createCustomer(payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteCustomer(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Khách hàng"
        description="Quản lý thông tin khách hàng"
        action={
          <Button className="!w-auto" onClick={openCreate}>
            + Thêm khách hàng
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm tên, SĐT, email..."
        className="mb-4 max-w-md"
      />

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Chưa có khách hàng"
          description="Thêm khách hàng để gắn với đơn hàng"
          action={
            <Button className="!w-auto" onClick={openCreate}>
              Thêm khách hàng
            </Button>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Liên hệ</th>
                <th className="hidden px-4 py-3 md:table-cell">Địa chỉ</th>
                <th className="hidden px-4 py-3 lg:table-cell">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{customer.phone}</p>
                    {customer.email && (
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {customer.address || '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                    {formatDateShort(customer.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(customer)}
                      className="mr-3 text-brand-600 hover:text-brand-700"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(customer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa khách hàng' : 'Thêm khách hàng'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" className="!w-auto" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button className="!w-auto" onClick={handleSave} loading={saving}>
              Lưu
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Họ tên *"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Input
            label="Số điện thoại *"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            label="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          />
          <label className="sm:col-span-2 block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Ghi chú</span>
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Modal>

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa khách hàng"
        message="Khách hàng sẽ bị xóa nếu chưa có đơn hàng liên kết."
        confirmLabel="Xóa"
        loading={deleting}
        danger
      />
    </>
  )
}
