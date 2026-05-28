import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { adjustStock, getInventoryLogs } from '../../api/inventory.api'
import { getProducts } from '../../api/product.api'
import { getSettings } from '../../api/shop.api'
import { formatDate } from '../../utils/format'
import { BatchImportModal } from '../../components/inventory/BatchImportModal'

export function InventoryPage() {
  const [products, setProducts] = useState([])
  const [logs, setLogs] = useState([])
  const [threshold, setThreshold] = useState(10)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ productId: '', type: 'out', quantity: '', note: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [batchImportOpen, setBatchImportOpen] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([getProducts(), getInventoryLogs(), getSettings()])
      .then(([prods, inventoryLogs, settings]) => {
        setProducts(prods)
        setLogs(inventoryLogs)
        setThreshold(settings.lowStockThreshold ?? 10)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const lowStock = products.filter(
    (p) => p.status === 'active' && p.stock <= threshold,
  )

  async function handleAdjust() {
    if (!form.productId) {
      setError('Chọn sản phẩm')
      return
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      setError('Số lượng không hợp lệ')
      return
    }
    setSaving(true)
    try {
      await adjustStock({
        productId: form.productId,
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note,
      })
      setModalOpen(false)
      setForm({ productId: '', type: 'out', quantity: '', note: '' })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Tồn kho"
        description="Theo dõi tồn kho và lịch sử nhập/xuất"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" className="!w-auto" onClick={() => { setError(''); setModalOpen(true) }}>
              - Xuất kho (Hư hỏng)
            </Button>
            <Button className="!w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => setBatchImportOpen(true)}>
              + Nhập lô hàng
            </Button>
          </div>
        }
      />

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : (
        <>
          {lowStock.length > 0 && (
            <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="font-semibold text-amber-900">
                ⚠️ {lowStock.length} sản phẩm sắp hết (≤ {threshold})
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {lowStock.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                    >
                      {p.name}
                      <Badge color="amber">Còn {p.stock}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-900">
              Tồn kho hiện tại
            </h2>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Tồn</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.stock <= threshold && p.status === 'active'
                            ? 'font-bold text-amber-600'
                            : ''
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={p.status === 'active' ? 'emerald' : 'slate'}>
                        {p.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-900">
              Lịch sử nhập / xuất
            </h2>
            {logs.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Chưa có giao dịch kho</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{log.productName}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(log.createdAt)}
                        {log.note && ` · ${log.note}`}
                      </p>
                    </div>
                    <Badge color={log.type === 'in' ? 'emerald' : 'amber'}>
                      {log.type === 'in' ? '+' : '−'}
                      {log.quantity}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Điều chỉnh tồn kho"
        footer={
          <>
            <Button variant="secondary" className="!w-auto" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button className="!w-auto" onClick={handleAdjust} loading={saving}>
              Xác nhận
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <Select
            label="Sản phẩm"
            value={form.productId}
            onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))}
            placeholder="-- Chọn sản phẩm --"
            options={products.map((p) => ({
              value: p.id,
              label: `${p.name} (tồn: ${p.stock})`,
            }))}
          />
          <Select
            label="Loại"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'out', label: 'Xuất kho (−)' },
            ]}
          />
          <Input
            label="Số lượng"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
          />
          <Input
            label="Ghi chú"
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
      </Modal>

      <BatchImportModal
        open={batchImportOpen}
        onClose={() => setBatchImportOpen(false)}
        products={products.filter((p) => p.status === 'active')}
        onSuccess={() => {
          setBatchImportOpen(false)
          load()
        }}
      />
    </>
  )
}
