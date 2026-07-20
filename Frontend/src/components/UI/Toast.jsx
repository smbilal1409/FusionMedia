// src/components/UI/Toast.jsx
// A simple toast system to replace ugly browser alert() calls.
// Usage:
//   import { useToast } from "../../components/UI/Toast";
//   const toast = useToast();
//   toast.success("Video uploaded!");
//   toast.error("Something went wrong");

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error:   (msg) => addToast(msg, "error"),
    info:    (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-xs w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl text-sm font-medium
              animate-[slideUp_0.3s_ease] transition-all
              ${t.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-400" : ""}
              ${t.type === "error"   ? "bg-red-500/10 border border-red-500/30 text-red-400"     : ""}
              ${t.type === "info"    ? "bg-[#ae7aff]/10 border border-[#ae7aff]/30 text-[#ae7aff]" : ""}
            `}
          >
            {t.type === "success" && <span>✓</span>}
            {t.type === "error"   && <span>✕</span>}
            {t.type === "info"    && <span>ℹ</span>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}