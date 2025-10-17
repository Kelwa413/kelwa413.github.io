import { useEffect } from "react";
import useScrollLock from "../hooks/useScrollLock";

export default function Modal({ open, onClose, children }) {
  // ✅ Hooks are ALWAYS called, regardless of `open`
  useScrollLock(open);

  useEffect(() => {
    if (!open) return; // gate the effect, don't skip the hook
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Rendering can be conditional AFTER hooks are called
  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
