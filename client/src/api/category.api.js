import { apiClient } from './client'

export const getCategories = () => apiClient.get('/api/categories').then(res => res.data.data)
export const createCategory = (payload) => apiClient.post('/api/categories', payload).then(res => res.data.data)
export const updateCategory = (id, payload) => apiClient.put(`/api/categories/${id}`, payload).then(res => res.data.data)
export const deleteCategory = (id) => apiClient.delete(`/api/categories/${id}`).then(res => res.data.data)
