"use client"
import * as React from "react"

export type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "success" | "error"
  errorMessage?: string
}

export const Toast: React.FC<ToastProps> = ({ title, description, errorMessage, variant = "default" }) => {
  // Төрлөөс хамаарч өнгө сонгох (Жишээ нь Error бол улаан хүрээ)
  const variantStyles = {
    default: "border-blue-200",
    success: "border-emerald-400",
    error: "border-red-400"
  }

  return (
    <div 
      className={`fixed top-24 right-5 z-[100] w-80 
        bg-white/95 backdrop-blur-md 
        border-l-4 ${variantStyles[variant || "default"]}
        rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] 
        p-5 transition-all animate-slide-in
        ring-1 ring-black/5`}
      style={{ fontFamily: "Arial, sans-serif" }} // Фонтыг Arial болгов
    >
      <div className="flex flex-col gap-1">
        {/* Гарчиг: Хүчтэй бараан өнгөөр */}
        <h4 className="text-[#102B5A] font-bold text-base leading-tight">
          {title}
        </h4>
        
        {/* Тайлбар: Саарал өнгөөр */}
        {description && (
          <p className="text-gray-600 text-sm font-medium">
            {description}
          </p>
        )}

        {/* Алдааны мессеж: Онцгой фонтой */}
        {errorMessage && (
          <div className="mt-2 text-[11px] font-mono text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 break-all">
            <span className="font-bold">Error:</span> {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}