export function openModal(title, bodyNode, opts = {}) {
  const host = document.getElementById("modalHost");
  host.classList.remove("hidden");
  host.innerHTML = "";

  const modal = document.createElement("div");
  modal.className = "modal";
  if (opts.wide) modal.classList.add("modal-wide");

  const inner = document.createElement("div");
  inner.className = "modal-inner";

  // Header
  const head = document.createElement("div");
  head.className = "modal-head";
  head.innerHTML = `<div class="modal-title">${escapeHtml(title)}</div>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close-btn";
  closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
  head.appendChild(closeBtn);

  // Body
  const body = document.createElement("div");
  body.className = "modal-body";
  body.appendChild(bodyNode);

  inner.appendChild(head);
  inner.appendChild(body);
  modal.appendChild(inner);
  host.appendChild(modal);

  const close = () => {
    modal.style.animation = "slideDown 0.18s ease forwards";
    setTimeout(() => {
      host.classList.add("hidden");
      host.innerHTML = "";
    }, 160);
  };

  closeBtn.addEventListener("click", close);
  host.addEventListener("click", (e) => { if (e.target === host) close(); });

  // Swipe down to close on mobile
  let startY = 0;
  modal.addEventListener("touchstart", e => { startY = e.touches[0].clientY; }, { passive: true });
  modal.addEventListener("touchend", e => {
    if (e.changedTouches[0].clientY - startY > 80) close();
  }, { passive: true });

  // Escape key
  const onKey = (e) => {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); }
  };
  document.addEventListener("keydown", onKey);

  return close;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}
