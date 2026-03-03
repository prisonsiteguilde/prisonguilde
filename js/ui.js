// js/ui.js
export function openModal(title, bodyNode) {
  const host = document.getElementById("modalHost");
  host.classList.remove("hidden");
  host.innerHTML = "";

  const modal = document.createElement("div");
  modal.className = "modal";
  const inner = document.createElement("div");
  inner.className = "modal-inner";

  const head = document.createElement("div");
  head.className = "modal-head";
  head.innerHTML = `<div class="modal-title">${escapeHtml(title)}</div>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "btn sm";
  closeBtn.style.width = "auto";
  closeBtn.textContent = "✕";
  head.appendChild(closeBtn);

  const body = document.createElement("div");
  body.className = "modal-body";
  body.appendChild(bodyNode);

  inner.appendChild(head);
  inner.appendChild(body);
  modal.appendChild(inner);
  host.appendChild(modal);

  const close = () => {
    host.classList.add("hidden");
    host.innerHTML = "";
  };

  closeBtn.addEventListener("click", close);
  host.addEventListener("click", (e) => { if (e.target === host) close(); });

  return close;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
