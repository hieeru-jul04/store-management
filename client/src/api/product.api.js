import { apiClient } from './client'

export const getProducts = () => apiClient.get('/api/products').then(res => res.data.data)
export const getProductById = (id) => apiClient.get(`/api/products/${id}`).then(res => res.data.data)
export const createProduct = (payload) => apiClient.post('/api/products', payload).then(res => res.data.data)
export const updateProduct = (id, payload) => apiClient.put(`/api/products/${id}`, payload).then(res => res.data.data)
export const deleteProduct = (id) => apiClient.delete(`/api/products/${id}`).then(res => res.data.data)
