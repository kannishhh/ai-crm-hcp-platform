import { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Info,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  markNotificationRead,
  markAllNotificationsRead,
  fetchNotifications,
  fetchUnreadCount,
  clearLocalNotifications,
} from "../../store/slices/notificationSlice";
import { cn } from "../../lib/utils";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notification,
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "compliance":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "ai":
        return <MessageSquare className="w-4 h-4 text-brand-500" />;
      case "interaction":
        return <Info className="w-4 h-4 text-brand-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-brand-500 transition-all shadow-sm"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-sm dark:text-white">
                Notifications
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-brand-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && handleMarkRead(n.id)}
                    className={cn(
                      "p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3",
                      !n.is_read && "bg-brand-50/30 dark:bg-brand-900/10",
                    )}
                  >
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-200">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    No new notifications
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={() => dispatch(clearLocalNotifications())}
                className="w-full py-3 text-[10px] font-bold text-slate-500 hover:text-rose-500 border-t border-slate-100 dark:border-slate-800 transition-colors uppercase tracking-widest"
              >
                Clear all
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
