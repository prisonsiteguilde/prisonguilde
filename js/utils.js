
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

export function fmtNum(n) { return Number(n || 0).toLocaleString("ru-RU"); }

export function fmtDec(n, d) {
  return Number(n || 0).toFixed(d !== undefined ? d : 2).replace(".", ",");
}

export function parseNum(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getRuPlural(n, f) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return f[2];
  if (b > 1  && b < 5)  return f[1];
  if (b === 1)           return f[0];
  return f[2];
}

export function formatTime(totalMin) {
  const t = Math.round(Math.abs(totalMin));
  const h = Math.floor(t / 60), m = t % 60;
  const hw = getRuPlural(h, ["час","часа","часов"]);
  const mw = getRuPlural(m, ["минута","минуты","минут"]);
  if (h === 0) return m + " " + mw;
  if (m === 0) return h + " " + hw;
  return h + " " + hw + " " + m + " " + mw;
}
