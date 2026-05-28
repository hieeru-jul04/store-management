export const ORDER_STATUS = {
  pending: { label: 'Chờ xử lý', color: 'amber' },
  confirmed: { label: 'Đã xác nhận', color: 'blue' },
  shipping: { label: 'Đang giao', color: 'violet' },
  completed: { label: 'Hoàn thành', color: 'emerald' },
  cancelled: { label: 'Đã hủy', color: 'slate' },
}

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, meta]) => ({
  value,
  label: meta.label,
}))
