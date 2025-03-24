"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type ToastProps = {
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
}

type ToastContextType = {
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...props, id }

    setToasts((prev) => [...prev, newToast])

    // Автоматически удаляем тост через 3 секунды
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg shadow-lg p-4 bg-background border max-w-md animate-in fade-in slide-in-from-bottom-5 ${
              t.type === "success"
                ? "border-green-500"
                : t.type === "error"
                  ? "border-red-500"
                  : t.type === "warning"
                    ? "border-yellow-500"
                    : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{t.title}</h3>
                {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const toast = (props: ToastProps) => {
  const context = useContext(ToastContext)
  if (!context) {
    console.error("useToast must be used within a ToastProvider")
    return
  }
  context.toast(props)
}

