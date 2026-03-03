// js/notify.js
export function notify(type, title, desc) {
  const host = document.getElementById("notifyHost");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="t">${escapeHtml(title)}</div>
    ${desc ? `<div class="d">${escapeHtml(desc)}</div>` : ""}
  `;
  host.appendChild(toast);

  // Auto-remove with fade
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s, transform 0.3s";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);

  // Click to dismiss
  toast.addEventListener("click", () => {
    toast.style.transition = "opacity 0.15s";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 150);
  });
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
