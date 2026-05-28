import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { createProduct, getProductById, updateProduct } from '../../api/product.api'
import { getCategories } from '../../api/category.api'

const emptyForm = {
  name: '',
  sku: '',
  categoryId: '',
  status: 'active',
  description: '',
}

export function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)

  useEffect(() => {
    getCategories().then(setCategories)
    if (!isEdit) {
      setForm((prev) => ({ ...prev, sku: `SP-${Date.now().toString().slice(-6)}` }))
      return
    }
    getProductById(id)
      .then((product) => {
        setForm({
          name: product.name,
          sku: product.sku,
          categoryId: product.categoryId,
          status: product.status,
          description: product.description || '',
        })
      })
      .catch(() => navigate('/products'))
      .finally(() => setPageLoading(false))
  }, [id, isEdit, navigate])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Vui lòng nhập tên sản phẩm'
    if (!form.sku.trim()) next.sku = 'Vui lòng nhập SKU'
    if (!form.categoryId) next.categoryId = 'Chọn danh mục'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        categoryId: form.categoryId,
        status: form.status,
        description: form.description.trim(),
      }
      if (isEdit) {
        await updateProduct(id, payload)
      } else {
        await createProduct(payload)
      }
      navigate('/products')
    } catch (err) {
      setApiError(err.message || 'Lưu thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <p className="text-sm text-slate-500">Đang tải...</p>
  }

  return (
  <>
      <PageHeader
        title={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        description={isEdit ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới cho cửa hàng'}
        action={
          <Link to="/products">
            <Button variant="secondary" className="!w-auto">
              ← Quay lại
            </Button>
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {apiError && <Alert className="mb-2">{apiError}</Alert>}

        <Input
          id="name"
          name="name"
          label="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          id="sku"
          name="sku"
          label="Mã SKU"
          value={form.sku}
          onChange={handleChange}
          error={errors.sku}
        />
        <Select
          id="categoryId"
          name="categoryId"
          label="Danh mục"
          value={form.categoryId}
          onChange={handleChange}
          error={errors.categoryId}
          placeholder="-- Chọn danh mục --"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="status"
            name="status"
            label="Trạng thái"
            value={form.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Đang bán' },
              { value: 'inactive', label: 'Ngừng bán' },
            ]}
          />
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Mô tả</span>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </label>

        <Button type="submit" loading={loading}>
          {isEdit ? 'Cập nhật' : 'Tạo sản phẩm'}
        </Button>
      </form>
    </>
  )
}
