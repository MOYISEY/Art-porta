"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
}

type ToastContextType = {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => string
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, type = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, type }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Автоматически удаляем тост через 5 секунд
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)

    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 bg-background border max-w-md animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "border-green-500"
              : toast.type === "error"
                ? "border-red-500"
                : toast.type === "warning"
                  ? "border-yellow-500"
                  : "border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => dismissToast(toast.id)} className="text-muted-foreground hover:text-foreground">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

