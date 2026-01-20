"use client"
import * as React from "react"
import { Toast, ToastProps } from "../components/ui/toast"

const ToastContext = React.createContext<{ showToast: (props: ToastProps) => void }>({
  showToast: () => {},
})

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = React.useState<ToastProps | null>(null)

  const showToast = (props: ToastProps) => {
    setToast(props)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  )
}

export const useSiteToast = () => React.useContext(ToastContext)