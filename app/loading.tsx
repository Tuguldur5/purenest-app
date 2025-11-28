"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
      {/* Алчуур шиг spinner */}
      <div className="w-24 h-24 border-8 border-blue-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
