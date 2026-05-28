import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { SearchInput } from '../../components/ui/SearchInput'
import { Select } from '../../components/ui/Select'
import { ORDER_STATUS_OPTIONS } from '../../constants/orderStatus'
import { createOrder, getOrders } from '../../api/order.api'
import { getCustomers } from '../../api/customer.api'
import { getProducts } from '../../api/product.api'
import { formatCurrency, formatDateShort } from '../../utils/format'

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    shippingAddress: '',
    note: '',
    items: [{ productId: '', quantity: '1', price: '' }],
    shippingToCustomerFee: '0',
    createdAt: '',
  })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filtered = useMemo(() => {
    let list = orders
    if (statusFilter) list = list.filter((o) => o.status === statusFilter)
    if (fromDate) list = list.filter((o) => new Date(o.createdAt) >= new Date(fromDate))
    if (toDate) {
      const end = new Date(toDate)
      end.setHours(23, 59, 59, 999)
      list = list.filter((o) => new Date(o.createdAt) <= end)
    }
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter(
        (o) =>
          o.code?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.phone?.includes(q),
      )
    }
    return list
  }, [orders, search, statusFilter, fromDate, toDate])

  function openCreate() {
    Promise.all([getProducts(), getCustomers()]).then(([prods, cus]) => {
      setProducts(prods.filter((p) => p.status === 'active' && p.stock > 0))
      setCustomers(cus)
    })
    setForm({
      customerId: '',
      customerName: '',
      phone: '',
      shippingAddress: '',
      note: '',
      items: [{ productId: '', quantity: '1', price: '' }],
      shippingToCustomerFee: '0',
      createdAt: '',
    })
    setFormError('')
    setCreateOpen(true)
  }

  function handleCustomerSelect(e) {
    const id = e.target.value
    const customer = customers.find((c) => String(c.id) === String(id))
    setForm((prev) => ({
      ...prev,
      customerId: id,
      customerName: customer?.name ?? prev.customerName,
      phone: customer?.phone ?? prev.phone,
      shippingAddress: customer?.address ?? prev.shippingAddress,
    }))
  }

  function handleAddItem() {
    setForm(prev => ({ ...prev, items: [...prev.items, { productId: '', quantity: '1', price: '' }] }))
  }

  function handleRemoveItem(index) {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
  }

  function handleItemChange(index, field, value) {
    setForm(prev => {
      const newItems = [...prev.items]
      newItems[index][field] = value
      return { ...prev, items: newItems }
    })
  }

  async function handleCreate() {
    if (!form.customerName.trim()) {
      setFormError('Vui lòng nhập tên khách hàng')
      return
    }
    
    if (form.items.length === 0) {
      setFormError('Cần ít nhất 1 sản phẩm')
      return
    }

    const payloadItems = []
    for (let i = 0; i < form.items.length; i++) {
      const item = form.items[i]
      const product = products.find((p) => String(p.id) === String(item.productId))
      if (!product) {
        setFormError(`Chọn sản phẩm dòng ${i + 1}`)
        return
      }
      const qty = Number(item.quantity)
      if (qty <= 0 || qty > product.stock) {
        setFormError(`Số lượng dòng ${i + 1} không hợp lệ (tồn: ${product.stock})`)
        return
      }
      const priceNum = Number(item.price)
      if (isNaN(priceNum) || priceNum < 0) {
        setFormError(`Giá bán dòng ${i + 1} không hợp lệ`)
        return
      }
      payloadItems.push({
        productId: product.id,
        productName: product.name,
        quantity: qty,
        price: priceNum,
      })
    }

    setSaving(true)
    try {
      await createOrder({
        customerId: form.customerId || null,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        shippingAddress: form.shippingAddress.trim(),
        note: form.note.trim(),
        items: payloadItems,
        shippingToCustomerFee: Number(form.shippingToCustomerFee) || 0,
        createdAt: form.createdAt ? new Date(form.createdAt).toISOString() : '',
      })
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Đơn hàng"
        description="Theo dõi và tạo đơn hàng mới"
        action={
          <Button className="!w-auto" onClick={openCreate}>
            + Tạo đơn hàng
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm mã đơn, khách hàng..."
          className="max-w-md flex-1"
        />
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="!w-auto sm:min-w-[130px]"
        />
        <span className="hidden text-slate-400 sm:inline">-</span>
        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="!w-auto sm:min-w-[130px]"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="!w-auto sm:min-w-[150px]"
          placeholder="Tất cả trạng thái"
          options={ORDER_STATUS_OPTIONS}
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Không có đơn hàng"
          description="Tạo đơn hàng đầu tiên cho cửa hàng"
          action={
            <Button className="!w-auto" onClick={openCreate}>
              Tạo đơn hàng
            </Button>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="hidden px-4 py-3 md:table-cell">Địa chỉ</th>
                <th className="hidden px-4 py-3 md:table-cell">Ngày tạo</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{order.code}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-900">{order.customerName}</p>
                    {order.phone && (
                      <p className="text-xs text-slate-500">{order.phone}</p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {order.shippingAddress || '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {formatDateShort(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      Xem →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tạo đơn hàng nhanh"
        size="lg"
        footer={
          <>
            <Button variant="secondary" className="!w-auto" onClick={() => setCreateOpen(false)}>
              Hủy
            </Button>
            <Button className="!w-auto" onClick={handleCreate} loading={saving}>
              Tạo đơn
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
          )}
          <Select
            label="Khách hàng có sẵn (tuỳ chọn)"
            value={form.customerId}
            onChange={handleCustomerSelect}
            placeholder="-- Khách lẻ / nhập tay --"
            options={customers.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.phone})`,
            }))}
          />
          <Input
            label="Tên khách hàng"
            value={form.customerName}
            onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
          />
          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <Input
            label="Địa chỉ giao hàng"
            value={form.shippingAddress}
            onChange={(e) => setForm((p) => ({ ...p, shippingAddress: e.target.value }))}
          />
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">Sản phẩm trong đơn</h3>
            {form.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <div className="col-span-12 md:col-span-5">
                  <Select
                    label="Sản phẩm"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    placeholder="-- Chọn sản phẩm --"
                    options={products.map((p) => ({
                      value: p.id,
                      label: `${p.name} (tồn: ${p.stock})`,
                    }))}
                  />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <Input
                    label="Số lượng"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-6 md:col-span-3">
                  <Input
                    label="Giá bán thực tế"
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  />
                </div>
                <div className="col-span-2 md:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 font-semibold mb-2 text-sm"
                    disabled={form.items.length === 1}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" className="!w-auto text-sm mt-2" onClick={handleAddItem}>
              + Thêm sản phẩm khác
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ngày tạo đơn (Để trống = hiện tại)"
              type="date"
              value={form.createdAt}
              onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))}
            />
            <Input
              label="Phí VC tới nhà khách"
              type="number"
              min="0"
              value={form.shippingToCustomerFee}
              onChange={(e) => setForm((p) => ({ ...p, shippingToCustomerFee: e.target.value }))}
            />
          </div>
          <Input
            label="Ghi chú"
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
      </Modal>
    </>
  )
}
