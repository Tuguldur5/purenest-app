"use client"
import * as React from "react"

export type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "success" | "error"
  errorMessage?: string
}

export const Toast: React.FC<ToastProps> = ({ title, description,errorMessage }) => {
  return (
    <div className="fixed top-24 right-5 z-50 bg-[#102B5A] text-white rounded-lg p-4 shadow-lg transition-transform animate-slide-in">
      <div className="text-white/80 text-sm">
        {description} {errorMessage && <span className="block font-mono mt-1 text-xs bg-black/20 p-1 rounded">{errorMessage}</span>}
      </div>
    </div>
  )
}
