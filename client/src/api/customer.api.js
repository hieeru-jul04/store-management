import { apiClient } from './client'

export const getCustomers = () => apiClient.get('/api/customers').then(res => res.data.data)
export const getCustomerById = (id) => apiClient.get(`/api/customers/${id}`).then(res => res.data.data)
export const createCustomer = (payload) => apiClient.post('/api/customers', payload).then(res => res.data.data)
export const updateCustomer = (id, payload) => apiClient.put(`/api/customers/${id}`, payload).then(res => res.data.data)
export const deleteCustomer = (id) => apiClient.delete(`/api/customers/${id}`).then(res => res.data.data)
