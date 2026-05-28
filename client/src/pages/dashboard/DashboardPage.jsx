import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge'
import { StatCard } from '../../components/ui/StatCard'
import { getDashboardStats } from '../../api/dashboard.api'
import { formatCurrency, formatDate } from '../../utils/format'

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => {
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải...</p>
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  if (!stats) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-slate-500">Thống kê nhanh cửa hàng hôm nay</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sản phẩm đang bán" value={stats.totalProducts} icon="📦" />
        <StatCard label="Đơn hôm nay" value={stats.ordersToday} icon="🛒" />
        <StatCard
          label="Doanh thu hôm nay"
          value={formatCurrency(stats.revenueToday)}
          icon="💰"
          variant="success"
        />
        <StatCard
          label="Sắp hết hàng"
          value={stats.lowStockCount}
          icon="⚠️"
          variant={stats.lowStockCount > 0 ? 'warning' : 'default'}
        />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Đơn hàng gần đây</h2>
            <Link to="/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Xem tất cả →
            </Link>
          </header>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có đơn hàng</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium text-slate-900 hover:text-brand-600"
                    >
                      {order.code}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(order.total)}
                    </p>
                    <OrderStatusBadge status={order.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Sản phẩm sắp hết</h2>
            <Link to="/inventory" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Quản lý kho →
            </Link>
          </header>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-slate-500">Tồn kho ổn định 👍</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Còn {product.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
