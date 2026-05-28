import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmModal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { SearchInput } from '../../components/ui/SearchInput'
import { deleteProduct, getProducts } from '../../api/product.api'
import { getCategories } from '../../api/category.api'
import { formatCurrency } from '../../utils/format'

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    )
  }, [products, search])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteProduct(deleteId)
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
        title="Sản phẩm"
        description="Quản lý danh sách sản phẩm cửa hàng"
        action={
          <Link to="/products/new">
            <Button className="!w-auto">+ Thêm sản phẩm</Button>
          </Link>
        }
      />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm theo tên hoặc SKU..."
        className="mb-4 max-w-md"
      />

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Chưa có sản phẩm"
          description="Thêm sản phẩm đầu tiên cho cửa hàng của bạn"
          action={
            <Link to="/products/new">
              <Button className="!w-auto">Thêm sản phẩm</Button>
            </Link>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="hidden px-4 py-3 sm:table-cell">Danh mục</th>
                <th className="hidden px-4 py-3 md:table-cell">Tồn kho</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sku}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                    {categoryMap[product.categoryId] ?? '—'}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span
                      className={
                        product.stock <= 10
                          ? 'font-semibold text-amber-600'
                          : 'text-slate-600'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={product.status === 'active' ? 'emerald' : 'slate'}>
                      {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="mr-3 text-brand-600 hover:text-brand-700"
                    >
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(product.id)}
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

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message="Bạn có chắc muốn xóa sản phẩm này? Hành động không thể hoàn tác."
        confirmLabel="Xóa"
        loading={deleting}
        danger
      />
    </>
  )
}
