import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Menu,
  Moon,
  Sun,
  Search,
  PlusCircle,
  Bell,
  Clock,
} from "lucide-react";
import { cn } from "./lib/utils";
import LogInteraction from "./pages/LogInteraction";
import DashboardView from "./pages/Dashboard";
import InteractionHistory from "./pages/InteractionHistory";
import NotificationBell from "./components/ui/NotificationBell";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useSocket } from "./hooks/useSocket";
import { Toaster } from "react-hot-toast";
import {
  toggleDarkMode,
  setSidebarOpen,
  toggleSidebar,
  setCurrentView,
  setWindowWidth,
} from "./store/slices/uiSlice";

import {
  fetchInteractions,
  fetchAnalytics,
} from "./store/slices/interactionSlice";
import { fetchHcps } from "./store/slices/hcpSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { isDarkMode, isSidebarOpen, currentView, windowWidth } =
    useAppSelector((state) => state.ui);

  useSocket();

  useEffect(() => {
    dispatch(fetchHcps());
    dispatch(fetchInteractions());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => dispatch(setWindowWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (windowWidth < 1024) {
      dispatch(setSidebarOpen(false));
    } else {
      dispatch(setSidebarOpen(true));
    }
  }, [windowWidth, dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => dispatch(toggleDarkMode());

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "log-interaction", label: "Log Interaction", icon: PlusCircle },
    { id: "history", label: "Interaction History", icon: Clock },
  ];

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300",
        isDarkMode ? "dark bg-slate-950" : "bg-slate-50",
      )}
    >
      <Toaster />
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : windowWidth < 1024 ? 0 : 80,
          x: windowWidth < 1024 && !isSidebarOpen ? -280 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={cn(
          "h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-30 overflow-hidden shrink-0",
          windowWidth < 1024 && "fixed left-0 top-0 h-full shadow-2xl",
          !isSidebarOpen && "items-center",
        )}
      >
        <div className="p-6 flex items-center gap-3 h-20">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl tracking-tight dark:text-white whitespace-nowrap"
              >
                PharmaConnect
              </motion.span>
            )}
          </AnimatePresence>
          {windowWidth < 1024 && isSidebarOpen && (
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="ml-auto p-2 text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                dispatch(setCurrentView(item.id));
                if (windowWidth < 1024) dispatch(setSidebarOpen(false));
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                currentView === item.id
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  currentView === item.id
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-200",
                )}
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {currentView === item.id && isSidebarOpen && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-6 bg-brand-600 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 font-medium hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50 rounded-2xl"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap"
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {/* <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 font-medium hover:bg-red-50 hover:text-red-700 rounded-2xl transition-colors">
            <LogOut className="w-5 h-5 transition-colors" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button> */}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-bottom border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Menu className="w-5 h-5 text-slate-500" />
              </motion.div>
            </button>
            <div className="relative group lg:block hidden">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-600 transition-colors" />
              <input
                type="text"
                placeholder="Search HCPs, logs, or materials..."
                className="bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-2.5 pl-10 pr-4 w-80 text-sm font-bold focus:ring-2 focus:ring-brand-500/20 transition-all outline-none dark:text-white text-slate-900 border border-slate-200 dark:border-transparent placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        <section className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardView
                  onLogInteraction={() =>
                    dispatch(setCurrentView("log-interaction"))
                  }
                />
              </motion.div>
            )}
            {currentView === "log-interaction" && (
              <motion.div
                key="log-interaction"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <LogInteraction />
              </motion.div>
            )}
            {currentView === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <InteractionHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
