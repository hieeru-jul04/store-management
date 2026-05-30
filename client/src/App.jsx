import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AlertProvider } from './contexts/AlertContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}

export default App
