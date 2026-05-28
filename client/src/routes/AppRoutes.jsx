import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from '../components/ProtectedRoute'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { CategoriesPage } from '../pages/categories/CategoriesPage'
import { CustomersPage } from '../pages/customers/CustomersPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { InventoryPage } from '../pages/inventory/InventoryPage'
import { OrderDetailPage } from '../pages/orders/OrderDetailPage'
import { OrdersPage } from '../pages/orders/OrdersPage'
import { ProductFormPage } from '../pages/products/ProductFormPage'
import { ProductsPage } from '../pages/products/ProductsPage'
import { SettingsPage } from '../pages/settings/SettingsPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
