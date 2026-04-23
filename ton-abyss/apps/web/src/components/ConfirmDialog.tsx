import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";

type Tone = "default" | "danger" | "warning";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: Tone;
}

interface ConfirmState {
  open: boolean;
  opts: ConfirmOptions | null;
  resolve: ((ok: boolean) => void) | null;
  show: (opts: ConfirmOptions) => Promise<boolean>;
  close: (ok: boolean) => void;
}

export const useConfirm = create<ConfirmState>((set, get) => ({
  open: false,
  opts: null,
  resolve: null,
  show: (opts) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, opts, resolve });
    }),
  close: (ok) => {
    const r = get().resolve;
    set({ open: false, opts: null, resolve: null });
    if (r) r(ok);
  },
}));

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  return useConfirm.getState().show(opts);
}

export function ConfirmDialog() {
  const { open, opts, close } = useConfirm();

  const toneColor =
    opts?.tone === "danger"
      ? { border: "border-red-500/40", bg: "bg-red-500/15", text: "text-red-200" }
      : opts?.tone === "warning"
      ? { border: "border-amber-400/40", bg: "bg-amber-500/15", text: "text-amber-200" }
      : { border: "border-abyss-400/40", bg: "bg-abyss-500/15", text: "text-abyss-200" };

  return (
    <AnimatePresence>
      {open && opts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => close(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`card p-5 w-full max-w-sm border ${toneColor.border} ${toneColor.bg}`}
          >
            <div className={`font-display text-lg ${toneColor.text} mb-2`}>{opts.title}</div>
            {opts.message && <div className="text-sm text-white/80 mb-4">{opts.message}</div>}
            <div className="flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => close(false)}>
                {opts.cancelText ?? "Отмена"}
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-bold text-sm border ${
                  opts.tone === "danger"
                    ? "bg-red-500/30 border-red-400/50 text-red-100"
                    : opts.tone === "warning"
                    ? "bg-amber-500/30 border-amber-400/50 text-amber-100"
                    : "bg-abyss-500/30 border-abyss-400/50 text-abyss-100"
                }`}
                onClick={() => close(true)}
              >
                {opts.confirmText ?? "Подтвердить"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
