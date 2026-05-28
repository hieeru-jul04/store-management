import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { ConfirmModal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../api/category.api'

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setEditing(null)
    setName('')
    setError('')
    setModalOpen(true)
  }

  function openEdit(cat) {
    setEditing(cat)
    setName(cat.name)
    setError('')
    setModalOpen(true)
  }

  async function handleSave() {
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateCategory(editing.id, { name })
      } else {
        await createCategory({ name })
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
      await deleteCategory(deleteId)
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
        title="Danh mục"
        description="Phân loại sản phẩm trong cửa hàng"
        action={
          <Button className="!w-auto" onClick={openCreate}>
            + Thêm danh mục
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải...</p>
      ) : categories.length === 0 ? (
        <EmptyState
          icon="🏷️"
          title="Chưa có danh mục"
          description="Tạo danh mục để phân loại sản phẩm"
          action={
            <Button className="!w-auto" onClick={openCreate}>
              Thêm danh mục
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="font-medium text-slate-900">{cat.name}</span>
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="text-sm text-brand-600 hover:text-brand-700"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(cat.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Xóa
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa danh mục' : 'Thêm danh mục'}
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
        <Input
          id="catName"
          label="Tên danh mục"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          error={error}
          autoFocus
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message="Danh mục sẽ bị xóa vĩnh viễn nếu không còn sản phẩm liên kết."
        confirmLabel="Xóa"
        loading={deleting}
        danger
      />
    </>
  )
}
