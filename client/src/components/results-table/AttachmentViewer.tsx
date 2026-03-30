import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, X } from "lucide-react";
import type { TxnAttachment } from "@/lib/types";

interface AttachmentViewerProps {
  attachment: TxnAttachment | null;
  onClose: () => void;
}

function AttachmentViewerInner({ attachment, onClose }: AttachmentViewerProps) {
  return (
    <AnimatePresence>
      {attachment && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            role="dialog" aria-modal="true" aria-label={attachment.name}
            className="bg-surface-card border border-slate-700/50 rounded-(--m3-shape-xl) shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span className="text-sm font-medium text-white">{attachment.name}</span>
              </div>
              <button onClick={onClose} aria-label="Close attachment viewer"
                className="p-1.5 rounded-(--m3-shape-sm) text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-400">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {attachment.type === "pdf" ? (
                <iframe src={attachment.url} title={attachment.name} className="w-full h-[65vh] rounded-(--m3-shape-sm) border border-surface-border" />
              ) : (
                <img src={attachment.url} alt={attachment.name} className="max-w-full mx-auto rounded-(--m3-shape-sm)" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const AttachmentViewer = React.memo(AttachmentViewerInner);
