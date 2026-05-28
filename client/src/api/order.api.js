import { apiClient } from './client'

export const getOrders = () => apiClient.get('/api/orders').then(res => res.data.data)
export const getOrderById = (id) => apiClient.get(`/api/orders/${id}`).then(res => res.data.data)
export const createOrder = (payload) => apiClient.post('/api/orders', payload).then(res => res.data.data)
export const updateOrderStatus = (id, status) => apiClient.put(`/api/orders/${id}/status`, { status }).then(res => res.data.data)
export const updateOrderInfo = (id, payload) => apiClient.put(`/api/orders/${id}`, payload).then(res => res.data.data)
export const deleteOrder = (id) => apiClient.delete(`/api/orders/${id}`).then(res => res.data.data)
