
const TOAST_ICONS = { ok: "✅", bad: "❌", warn: "⚠️" };

export function notify(type, title, desc) {
  const host = document.getElementById("notifyHost");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("data-icon", TOAST_ICONS[type] || "ℹ️");
  toast.innerHTML = `
    <div class="t">${escapeHtml(title)}</div>
    ${desc ? `<div class="d">${escapeHtml(desc)}</div>` : ""}
  `;
  host.appendChild(toast);

  // Лимит — максимум 4 тоста одновременно
  const toasts = host.querySelectorAll(".toast");
  if (toasts.length > 4) toasts[0].remove();

  const dismiss = () => {
    toast.style.transition = "opacity 0.25s, transform 0.25s";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 250);
  };

  const timer = setTimeout(dismiss, 3500);

  toast.addEventListener("click", () => {
    clearTimeout(timer);
    dismiss();
  });
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
