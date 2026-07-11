import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "./ui/Toast.jsx";

const ToastContext = createContext(null);

export function Toaster({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default", duration = 3500 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant, open: true }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      <ToastProvider swipeDirection="right">
        {children}
        {toasts.map(t => (
          <Toast key={t.id} variant={t.variant} open={t.open}>
            <div className="flex flex-col gap-0.5">
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster>");
  return ctx;
}
