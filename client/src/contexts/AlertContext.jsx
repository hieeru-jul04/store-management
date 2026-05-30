import { createContext, useCallback, useMemo, useState } from 'react'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error', // 'error' | 'success' | 'info'
  })

  const showAlert = useCallback((title, message, type = 'error') => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
    })
  }, [])

  const closeAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const value = useMemo(
    () => ({
      showAlert,
      closeAlert,
    }),
    [showAlert, closeAlert]
  )

  const getIcon = () => {
    switch (alert.type) {
      case 'error':
        return '❌'
      case 'success':
        return '✅'
      default:
        return 'ℹ️'
    }
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Modal
        open={alert.isOpen}
        onClose={closeAlert}
        title={<span className="flex items-center gap-2">{getIcon()} {alert.title}</span>}
        size="sm"
        footer={
          <Button className="!w-auto" onClick={closeAlert}>
            Đóng
          </Button>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">{alert.message}</p>
      </Modal>
    </AlertContext.Provider>
  )
}
