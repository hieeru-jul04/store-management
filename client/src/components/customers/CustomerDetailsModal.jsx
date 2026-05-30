import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../api/order.api'
import { formatCurrency, formatDateShort } from '../../utils/format'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { OrderStatusBadge } from '../orders/OrderStatusBadge'

export function CustomerDetailsModal({ open, customer, onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && customer) {
      setLoading(true)
      getOrders()
        .then((allOrders) => {
          const customerOrders = allOrders.filter(
            (o) => String(o.customerId) === String(customer.id)
          )
          setOrders(customerOrders)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open, customer])

  if (!customer) return null

  const totalSpent = orders.reduce((sum, order) => {
    // Only count non-cancelled orders towards total spent if desired, 
    // but typically all successful/active orders are counted.
    if (order.status !== 'CANCELLED') {
      return sum + order.total
    }
    return sum
  }, 0)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chi tiết khách hàng"
      size="xl"
      footer={
        <Button variant="secondary" className="!w-auto" onClick={onClose}>
          Đóng
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Info Sidebar */}
        <div className="space-y-6 md:col-span-1">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 font-semibold text-slate-900">Thông tin liên hệ</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Họ tên</dt>
                <dd className="font-medium text-slate-900">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Số điện thoại</dt>
                <dd className="font-medium text-slate-900">{customer.phone}</dd>
              </div>
              {customer.email && (
                <div>
                  <dt className="text-slate-500">Email</dt>
                  <dd className="text-slate-900">{customer.email}</dd>
                </div>
              )}
              {customer.address && (
                <div>
                  <dt className="text-slate-500">Địa chỉ</dt>
                  <dd className="text-slate-900">{customer.address}</dd>
                </div>
              )}
              {customer.note && (
                <div>
                  <dt className="text-slate-500">Ghi chú</dt>
                  <dd className="text-slate-900">{customer.note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <h3 className="mb-1 font-semibold text-brand-900">Tổng chi tiêu</h3>
            <p className="text-2xl font-bold text-brand-700">
              {loading ? '...' : formatCurrency(totalSpent)}
            </p>
            <p className="mt-1 text-xs text-brand-600">
              Từ {orders.length} đơn hàng
            </p>
          </section>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <h3 className="mb-3 font-semibold text-slate-900">Lịch sử đặt hàng</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Đang tải đơn hàng...</p>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              Khách hàng chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Mã ĐH</th>
                    <th className="px-4 py-3">Ngày đặt</th>
                    <th className="px-4 py-3">Tổng tiền</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {order.code || `#${order.id}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDateShort(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-brand-600 hover:text-brand-700"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
