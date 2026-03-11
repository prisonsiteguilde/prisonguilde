import { renderRecipes }    from "./pages/recipes.js";
import { renderCalculator } from "./pages/calculator.js";
import { notify }           from "./notify.js";
import { renderAffixes }    from "./pages/affixes.js";
import { renderBarygа }     from "./pages/baryga.js";
import { renderBosses }     from "./pages/bosses.js";
import { renderMinions }    from "./pages/minions.js";
import { renderSets }       from "./pages/sets.js";
import { renderEffects }    from "./pages/effects.js";

const routes = {
  recipes:    renderRecipes,
  calculator: renderCalculator,
  affixes:    renderAffixes,
  baryga:     renderBarygа,
  bosses:     renderBosses,
  minions:    renderMinions,
  sets:       renderSets,
  effects:    renderEffects,
};

let currentRoute = "recipes";


async function navigate(route) {
  if (!routes[route]) route = "recipes";
  currentRoute = route;
  location.hash = route;

  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });

  const page = document.getElementById("page");
  page.innerHTML = `
    <div class="loader">
      <div class="loader-spinner"></div>
      <div class="loader-text">Загрузка...</div>
    </div>
  `;

  try {
    const content = await routes[route]();
    page.innerHTML = "";
    content.classList.add("page-fade-in");
    page.appendChild(content);
  } catch (e) {
    console.error(e);
    page.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <div class="empty-text">Ошибка: ${escHtml(e?.message || String(e))}</div>
      </div>
    `;
    notify("bad", "Ошибка", e.message || String(e));
  }
}


const THEMES = [
  { key: "theme-dark",  icon: "🌙", label: "Тёмная"  },
  { key: "theme-neon",  icon: "⚡",  label: "Неон"    },
  { key: "theme-blood", icon: "🩸", label: "Красная"   },
  { key: "theme-light", icon: "☀️",  label: "Светлая" },
];

function applyTheme(key) {
  const theme = THEMES.find(t => t.key === key) || THEMES[0];

  // Remove all theme classes, add new one
  document.body.classList.remove(...THEMES.map(t => t.key));
  document.body.classList.add(theme.key);
  localStorage.setItem("theme", theme.key);

  // Update mobile icon
  const mobileIcon = document.getElementById("themeIcon");
  if (mobileIcon) mobileIcon.textContent = theme.icon;

  // Update sidebar switcher active state
  document.querySelectorAll(".theme-opt").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme.key);
  });

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    const colors = {
      "theme-dark":  "#080a0e",
      "theme-neon":  "#050810",
      "theme-blood": "#0c0508",
      "theme-light": "#f0f2f8",
    };
    metaTheme.content = colors[theme.key] || "#080a0e";
  }
}

function cycleTheme() {
  const cur = THEMES.findIndex(t => document.body.classList.contains(t.key));
  const next = THEMES[(cur + 1) % THEMES.length];
  applyTheme(next.key);
  notify("ok", next.label, "Тема применена");
}

/* ─── Init ────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

  // Apply saved or default theme
  const savedTheme = localStorage.getItem("theme") || "theme-dark";
  applyTheme(savedTheme);

  // Mobile theme toggle (cycle)
  document.getElementById("themeToggle")?.addEventListener("click", cycleTheme);

  // Sidebar theme switcher (direct select)
  document.getElementById("themeSwitcher")?.addEventListener("click", e => {
    const btn = e.target.closest(".theme-opt");
    if (btn?.dataset.theme) {
      const t = THEMES.find(x => x.key === btn.dataset.theme);
      applyTheme(btn.dataset.theme);
      if (t) notify("ok", t.label, "Тема применена");
    }
  });

  // All nav buttons (sidebar + bottom nav)
  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.route));
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !isInputFocused())) {
      e.preventDefault();
      const searchEl = document.getElementById("q") || document.getElementById("bossSearch") || document.getElementById("effSearch");
      if (searchEl) { searchEl.focus(); searchEl.select(); }
    }

    if (e.ctrlKey && e.key === "1") { e.preventDefault(); navigate("recipes"); }
    if (e.ctrlKey && e.key === "2") { e.preventDefault(); navigate("calculator"); }
    if (e.ctrlKey && e.key === "3") { e.preventDefault(); navigate("affixes"); }
    if (e.ctrlKey && e.key === "4") { e.preventDefault(); navigate("baryga"); }
    if (e.ctrlKey && e.key === "5") { e.preventDefault(); navigate("bosses"); }
    if (e.ctrlKey && e.key === "6") { e.preventDefault(); navigate("minions"); }
    if (e.ctrlKey && e.key === "7") { e.preventDefault(); navigate("sets"); }
    if (e.ctrlKey && e.key === "8") { e.preventDefault(); navigate("effects"); }

    if (e.key === "Escape") {
      const modal = document.getElementById("modalHost");
      if (modal && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
        modal.innerHTML = "";
        return;
      }
      const searchEl = document.getElementById("q");
      if (searchEl && document.activeElement === searchEl && searchEl.value) {
        searchEl.value = "";
        searchEl.dispatchEvent(new Event("input"));
      }
    }
  });

  // Initial route
  const hash = location.hash.slice(1) || "recipes";
  navigate(hash);

  window.addEventListener("hashchange", () => {
    navigate(location.hash.slice(1) || "recipes");
  });
});

function isInputFocused() {
  const el = document.activeElement;
  return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT");
}

function escHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}
