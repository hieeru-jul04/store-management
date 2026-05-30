import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge'
import { StatCard } from '../../components/ui/StatCard'
import { Select } from '../../components/ui/Select'
import { Input } from '../../components/ui/Input'
import { getDashboardStats } from '../../api/dashboard.api'
import { formatCurrency, formatDate } from '../../utils/format'
import { FinancialChart } from '../../components/dashboard/FinancialChart'

export function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [filterType, setFilterType] = useState('month')
  const [dateValue, setDateValue] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}` // current month
  })

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .catch((err) => {
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu')
      })
      .finally(() => setLoading(false))
  }, [])

  function handleFilterTypeChange(e) {
    const newType = e.target.value
    setFilterType(newType)
    const today = new Date()
    if (newType === 'day') {
      setDateValue(today.toISOString().split('T')[0])
    } else if (newType === 'month') {
      setDateValue(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)
    } else if (newType === 'year') {
      setDateValue(String(today.getFullYear()))
    }
  }

  // Derived state
  const filteredOrders = useMemo(() => {
    if (!data?.orders) return []
    return data.orders.filter((o) => {
      const orderDate = new Date(o.createdAt)
      if (filterType === 'day') {
        // match YYYY-MM-DD
        const localDateString = new Date(orderDate.getTime() - orderDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0]
        return localDateString === dateValue
      }
      if (filterType === 'month') {
        // match YYYY-MM
        const m = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`
        return m === dateValue
      }
      if (filterType === 'year') {
        // match YYYY
        return String(orderDate.getFullYear()) === dateValue
      }
      return false
    })
  }, [data, filterType, dateValue])

  const financialStats = useMemo(() => {
    const validOrders = filteredOrders.filter(
      (o) => o.status !== 'CANCELLED' && o.status !== 'cancelled'
    )
    const revenue = validOrders.reduce((sum, o) => sum + o.total, 0)
    const profit = validOrders.reduce((sum, o) => sum + (o.actualProfit || 0), 0)
    return { count: validOrders.length, revenue, profit }
  }, [filteredOrders])

  const inventoryStats = useMemo(() => {
    if (!data?.products) return { totalProducts: 0, lowStockCount: 0, lowStockProducts: [] }
    const threshold = data.settings?.lowStockThreshold ?? 10
    const activeProducts = data.products.filter((p) => p.status === 'active')
    const lowStock = activeProducts.filter((p) => p.stock <= threshold)
    return {
      totalProducts: activeProducts.length,
      lowStockCount: lowStock.length,
      lowStockProducts: lowStock.slice(0, 5),
    }
  }, [data])

  const recentOrders = useMemo(() => {
    if (!data?.orders) return []
    return [...data.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [data])

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải...</p>
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
          <p className="mt-1 text-sm text-slate-500">Báo cáo hoạt động kinh doanh và kho hàng</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <Select
            value={filterType}
            onChange={handleFilterTypeChange}
            options={[
              { value: 'day', label: 'Theo ngày' },
              { value: 'month', label: 'Theo tháng' },
              { value: 'year', label: 'Theo năm' },
            ]}
            className="!min-w-[140px] border-none bg-slate-50 shadow-none focus:ring-0"
          />
          {filterType === 'day' && (
            <Input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="border-none bg-slate-50 shadow-none focus:ring-0"
            />
          )}
          {filterType === 'month' && (
            <Input
              type="month"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="border-none bg-slate-50 shadow-none focus:ring-0"
            />
          )}
          {filterType === 'year' && (
            <Input
              type="number"
              min="2000"
              max="2100"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-24 border-none bg-slate-50 shadow-none focus:ring-0"
            />
          )}
        </div>
      </div>

      {/* Financial Section */}
      <section>
        <h2 className="mb-4 font-semibold text-slate-900">Hoạt động kinh doanh</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Số đơn hàng"
            value={financialStats.count}
            icon="🛒"
          />
          <StatCard
            label="Doanh thu"
            value={formatCurrency(financialStats.revenue)}
            icon="💰"
            variant="success"
          />
          <StatCard
            label="Lợi nhuận"
            value={formatCurrency(financialStats.profit)}
            icon="📈"
            variant="success"
          />
        </div>
        
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FinancialChart
            orders={filteredOrders}
            filterType={filterType}
            dateValue={dateValue}
          />
        </div>
      </section>

      {/* Inventory & Recent Orders Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Kho hàng & Sản phẩm</h2>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Tổng sản phẩm" value={inventoryStats.totalProducts} icon="📦" />
            <StatCard
              label="Sắp hết hàng"
              value={inventoryStats.lowStockCount}
              icon="⚠️"
              variant={inventoryStats.lowStockCount > 0 ? 'warning' : 'default'}
            />
          </div>
          
          <div className="mt-6">
            <header className="mb-3 flex items-center justify-between">
              <h3 className="font-medium text-slate-700">Sản phẩm sắp hết ({inventoryStats.lowStockCount})</h3>
              <Link to="/inventory" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                Quản lý kho →
              </Link>
            </header>
            {inventoryStats.lowStockProducts.length === 0 ? (
              <p className="text-sm text-slate-500">Tồn kho ổn định 👍</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {inventoryStats.lowStockProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between py-2">
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
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Đơn hàng gần đây</h2>
            <Link to="/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Xem tất cả →
            </Link>
          </header>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có đơn hàng</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium text-slate-900 hover:text-brand-600"
                    >
                      {order.code || `#${order.id}`}
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
      </section>
    </div>
  )
}
