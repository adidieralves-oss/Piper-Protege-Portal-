import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Save } from 'lucide-react';

type NotifType = 'success' | 'error' | 'warning' | 'info' | 'save';

interface Notification {
  id: string;
  message: string;
  type: NotifType;
  title?: string;
}

interface NotificationContextType {
  notify: (message: string, type?: NotifType, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: NotifType = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [{ id, message, type, title }, ...prev].slice(0, 4));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 w-full max-w-[380px] pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-md flex gap-3 items-start ${
                n.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-50' :
                n.type === 'error' ? 'bg-red-950/95 border-red-500/30 text-red-50' :
                n.type === 'warning' ? 'bg-amber-950/95 border-amber-500/30 text-amber-50' :
                n.type === 'save' ? 'bg-blue-950/95 border-blue-500/30 text-blue-50' :
                'bg-bg-elevated/95 border-white/10 text-text-primary'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                {n.type === 'save' && <Save className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                {n.title && <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{n.title}</div>}
                <div className="text-sm font-medium leading-relaxed">{n.message}</div>
              </div>
              <button onClick={() => removeNotif(n.id)} className="shrink-0 text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  n.type === 'success' ? 'bg-emerald-500' :
                  n.type === 'error' ? 'bg-red-500' :
                  n.type === 'warning' ? 'bg-amber-500' :
                  'bg-secondary'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return context;
};
