import { apiClient } from './client'

export const getInventoryLogs = () => apiClient.get('/api/inventory-logs').then(res => res.data.data)
export const adjustStock = (payload) => apiClient.post('/api/inventory-logs', payload).then(res => res.data.data)
export const batchImportStock = (payload) => apiClient.post('/api/inventory-logs/batch', payload).then(res => res.data.data)
