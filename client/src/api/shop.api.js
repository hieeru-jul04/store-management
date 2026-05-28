import { apiClient } from './client'

export const getSettings = () => apiClient.get('/api/settings').then(res => res.data.data)
export const updateSettings = (payload) => apiClient.put('/api/settings', payload).then(res => res.data.data)
