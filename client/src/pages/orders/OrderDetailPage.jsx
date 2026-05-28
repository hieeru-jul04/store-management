import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Modal, ConfirmModal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { ORDER_STATUS_OPTIONS } from '../../constants/orderStatus'
import { getOrderById, updateOrderStatus, updateOrderInfo, deleteOrder } from '../../api/order.api'
import { formatCurrency, formatDateShort } from '../../utils/format'

export function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm] = useState({ phone: '', shippingAddress: '', note: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleStatusChange(e) {
    const status = e.target.value
    setUpdating(true)
    try {
      const updated = await updateOrderStatus(id, status)
      setOrder(updated)
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(false)
    }
  }

  function openEdit() {
    setForm({
      phone: order.phone || '',
      shippingAddress: order.shippingAddress || '',
      note: order.note || '',
    })
    setEditOpen(true)
  }

  async function handleSaveInfo() {
    setSaving(true)
    try {
      const updated = await updateOrderInfo(id, form)
      setOrder(updated)
      setEditOpen(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteOrder(id)
      navigate('/orders')
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải...</p>
  }

  if (!order) {
    return (
      <EmptyOrder />
    )
  }

  return (
    <>
      <PageHeader
        title={order.code}
        description={`Tạo ngày ${formatDateShort(order.createdAt)}`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" className="!w-auto" onClick={openEdit}>
              Sửa thông tin
            </Button>
            <Button variant="danger" className="!w-auto bg-red-600 hover:bg-red-700 text-white" onClick={() => setDeleteOpen(true)}>
              Xóa đơn
            </Button>
            <Link to="/orders">
              <Button variant="secondary" className="!w-auto">
                ← Quay lại
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Sản phẩm trong đơn</h2>
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-100 text-left text-xs text-slate-500">
                <tr>
                  <th className="pb-2">Sản phẩm</th>
                  <th className="pb-2 text-center">SL</th>
                  <th className="pb-2 text-right">Đơn giá</th>
                  <th className="pb-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-900">{item.productName}</td>
                    <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-600">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold text-slate-700">
                    Tổng cộng
                  </td>
                  <td className="pt-4 text-right text-lg font-bold text-brand-700">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </article>
        </section>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Thông tin đơn</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Khách hàng</dt>
                <dd className="font-medium text-slate-900">{order.customerName}</dd>
              </div>
              {order.phone && (
                <div>
                  <dt className="text-slate-500">Điện thoại</dt>
                  <dd className="font-medium text-slate-900">{order.phone}</dd>
                </div>
              )}
              {order.shippingAddress && (
                <div>
                  <dt className="text-slate-500">Địa chỉ giao hàng</dt>
                  <dd className="text-slate-700">{order.shippingAddress}</dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500">Phí VC tới nhà khách</dt>
                <dd className="font-medium text-slate-900">{formatCurrency(order.shippingToCustomerFee || 0)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Lợi nhuận thực tế</dt>
                <dd className="font-medium text-emerald-600">{formatCurrency(order.actualProfit || 0)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Trạng thái hiện tại</dt>
                <dd className="mt-1">
                  <OrderStatusBadge status={order.status} />
                </dd>
              </div>
              {order.note && (
                <div>
                  <dt className="text-slate-500">Ghi chú</dt>
                  <dd className="text-slate-700">{order.note}</dd>
                </div>
              )}
            </dl>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-semibold text-slate-900">Cập nhật trạng thái</h2>
            <Select
              value={order.status}
              onChange={handleStatusChange}
              disabled={updating}
              options={ORDER_STATUS_OPTIONS}
            />
          </article>
        </aside>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Sửa thông tin đơn hàng"
        footer={
          <>
            <Button variant="secondary" className="!w-auto" onClick={() => setEditOpen(false)}>
              Hủy
            </Button>
            <Button className="!w-auto" onClick={handleSaveInfo} loading={saving}>
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="space-y-4">
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
          <Input
            label="Ghi chú"
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này? Số lượng tồn kho của các sản phẩm trong đơn sẽ được hoàn lại tự động."
        confirmLabel="Xóa đơn hàng"
        loading={deleting}
        danger
      />
    </>
  )
}

function EmptyOrder() {
  return (
    <div className="text-center">
      <p className="text-slate-500">Không tìm thấy đơn hàng</p>
      <Link to="/orders" className="mt-2 inline-block text-brand-600 hover:text-brand-700">
        ← Quay lại danh sách
      </Link>
    </div>
  )
}
