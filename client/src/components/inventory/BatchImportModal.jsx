import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { batchImportStock } from '../../api/inventory.api'

export function BatchImportModal({ open, onClose, products, onSuccess }) {
  const [items, setItems] = useState([{ productId: '', quantity: '1', importPrice: '0', shippingFeePerItem: '0' }])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleAddItem() {
    setItems([...items, { productId: '', quantity: '1', importPrice: '0', shippingFeePerItem: '0' }])
  }

  function handleRemoveItem(index) {
    setItems(items.filter((_, i) => i !== index))
  }

  function handleItemChange(index, field, value) {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  async function handleSubmit() {
    if (items.length === 0) {
      setError('Cần ít nhất 1 sản phẩm')
      return
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.productId) return setError(`Sản phẩm dòng ${i + 1} chưa chọn`)
      if (Number(item.quantity) <= 0) return setError(`Số lượng dòng ${i + 1} không hợp lệ`)
      if (Number(item.importPrice) < 0) return setError(`Giá nhập dòng ${i + 1} không hợp lệ`)
      if (Number(item.shippingFeePerItem) < 0) return setError(`Phí vận chuyển dòng ${i + 1} không hợp lệ`)
    }

    setSaving(true)
    setError('')
    try {
      const payload = {
        note: note.trim(),
        items: items.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          importPrice: Number(item.importPrice),
          shippingFeePerItem: Number(item.shippingFeePerItem)
        }))
      }
      await batchImportStock(payload)
      setItems([{ productId: '', quantity: '1', importPrice: '0', shippingFeePerItem: '0' }])
      setNote('')
      onSuccess()
    } catch (err) {
      setError(err.message || 'Lỗi khi nhập kho')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nhập lô hàng (Nhiều sản phẩm)"
      size="xl"
      footer={
        <>
          <Button variant="secondary" className="!w-auto" onClick={onClose}>Hủy</Button>
          <Button className="!w-auto" onClick={handleSubmit} loading={saving}>Lưu phiếu nhập</Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <div className="col-span-12 md:col-span-4">
                <Select
                  label="Sản phẩm"
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  options={products.map((p) => ({ value: p.id, label: p.name }))}
                  placeholder="Chọn sản phẩm"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  label="SL"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  label="Giá nhập/SP"
                  type="number"
                  min="0"
                  value={item.importPrice}
                  onChange={(e) => handleItemChange(index, 'importPrice', e.target.value)}
                />
              </div>
              <div className="col-span-4 md:col-span-3">
                <Input
                  label="Phí VC/SP"
                  type="number"
                  min="0"
                  value={item.shippingFeePerItem}
                  onChange={(e) => handleItemChange(index, 'shippingFeePerItem', e.target.value)}
                />
              </div>
              <div className="col-span-12 md:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 font-semibold mb-2"
                  disabled={items.length === 1}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="secondary" className="!w-auto text-sm" onClick={handleAddItem}>
          + Thêm sản phẩm
        </Button>

        <Input
          label="Ghi chú (Tên lô / Phiếu nhập)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ví dụ: Nhập hàng đợt 1 tháng 6"
        />
      </div>
    </Modal>
  )
}
