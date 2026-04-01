import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Columns3 } from "lucide-react";
import { ALL_COLS } from "@/lib/mock-data";
import { IconButton } from "@/components/shared/IconButton";
import { cn } from "@/lib/utils";

type ColsState = { risk: boolean; trnNum: boolean; trnDate: boolean; amount: boolean; payee: boolean; operativeAcct: boolean; instType: boolean; valDate: boolean; offsetNum: boolean };

interface ColumnPickerProps {
  showColPicker: boolean;
  setShowColPicker: React.Dispatch<React.SetStateAction<boolean>>;
  cols: ColsState;
  setCols: React.Dispatch<React.SetStateAction<ColsState>>;
  colPickerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

function ColumnPickerInner({ showColPicker, setShowColPicker, cols, setCols, colPickerRef, className }: ColumnPickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(showColPicker);

  useEffect(() => {
    if (prevOpen.current && !showColPicker) {
      triggerRef.current?.focus();
    }
    prevOpen.current = showColPicker;
  }, [showColPicker]);

  return (
    <div className={cn("relative", className)} ref={colPickerRef}>
      <IconButton
        ref={triggerRef}
        onClick={() => setShowColPicker(v => !v)}
        aria-expanded={showColPicker}
        aria-haspopup="dialog"
        icon={<Columns3 className="w-3.5 h-3.5" aria-hidden="true" />}
        className="text-xs text-[var(--ds-color-text-secondary)] hover:text-white border border-[var(--ds-color-border-default)]/60 hover:border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-page)]"
      >
        Columns
      </IconButton>
      <AnimatePresence>
        {showColPicker && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            role="dialog" aria-label="Column visibility"
            className="absolute right-0 top-full mt-1.5 w-48 bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/60 rounded-[var(--ds-radius-xl)] shadow-2xl p-3 z-30">
            <p className="text-xs uppercase tracking-widest text-[var(--ds-color-text-secondary)] font-medium mb-2">Show / hide columns</p>
            {Object.entries(ALL_COLS).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                <input type="checkbox"
                  checked={cols[key as keyof typeof cols]}
                  onChange={() => setCols(c => ({ ...c, [key]: !c[key as keyof typeof c] }))}
                  className="w-4 h-4 rounded accent-[var(--ds-color-brand-primary)]" />
                <span className="text-xs text-[var(--ds-color-text-secondary)] group-hover:text-white transition-colors">{label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const ColumnPicker = React.memo(ColumnPickerInner);
