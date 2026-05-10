import { useRef, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Label from "../ui/Label";
import { cn } from "../../lib/utils";

export default function HcpSelector({ 
  hcps, 
  selectedHcp, 
  setSelectedHcp, 
  searchTerm, 
  setSearchTerm, 
  isDropdownOpen, 
  setIsDropdownOpen 
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsDropdownOpen]);

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <Label>
        Healthcare Professional <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-400" />
        <input
          type="text"
          placeholder="Search clinical directory..."
          value={searchTerm}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all dark:text-white text-slate-950"
        />
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 w-full mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
            >
              {hcps
                .filter((h) =>
                  h.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((hcp) => (
                  <button
                    key={hcp.id}
                    onClick={() => {
                      setSelectedHcp(hcp);
                      setSearchTerm(hcp.name);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all text-left border-b border-slate-50 dark:border-slate-800 last:border-0 group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 group-hover/item:bg-brand-100 dark:group-hover/item:bg-brand-800 group-hover/item:text-brand-600 transition-colors">
                      {hcp.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold dark:text-white text-slate-950 group-hover/item:text-brand-600 transition-colors">
                        {hcp.name}
                      </p>
                      <p className="text-xs text-slate-500 font-bold">
                        Specialist • Clinical Directory
                      </p>
                    </div>
                    {selectedHcp?.id === hcp.id && (
                      <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-brand-600" />
                      </div>
                    )}
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
