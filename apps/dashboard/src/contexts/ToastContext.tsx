import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[300px] p-4 rounded-xl shadow-xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out_forwards] backdrop-blur-md border border-white/10 ${
              toast.type === 'success' ? 'bg-[#1b1a26]/90 border-primary-container' : 
              toast.type === 'error' ? 'bg-[#93000a]/90 border-error' : 
              'bg-[#343440]/90 border-secondary'
            }`}
          >
            <span className={`material-symbols-outlined ${
              toast.type === 'success' ? 'text-primary-container' : 
              toast.type === 'error' ? 'text-error' : 
              'text-secondary'
            }`}>
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <p className="text-white text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
