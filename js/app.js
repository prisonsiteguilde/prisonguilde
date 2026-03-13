// js/app.js v4.0 — sidebar + 4 themes
import { renderRecipes }    from "./pages/recipes.js";
import { renderCalculator } from "./pages/calculator.js";
import { notify }           from "./notify.js";
import { renderAffixes }    from "./pages/affixes.js";
import { renderBarygа }     from "./pages/baryga.js";
import { renderBosses }     from "./pages/bosses.js";
import { renderMinions }    from "./pages/minions.js";
import { renderSets }       from "./pages/sets.js";
import { renderEffects }    from "./pages/effects.js";
import { renderSafe }       from "./pages/safe.js";

const routes = {
  recipes:    renderRecipes,
  calculator: renderCalculator,
  affixes:    renderAffixes,
  baryga:     renderBarygа,
  bosses:     renderBosses,
  minions:    renderMinions,
  sets:       renderSets,
  effects:    renderEffects,
  safe:       renderSafe,
};

let currentRoute = "recipes";

// More menu elements (global scope for navigate function)
let moreBtn = null;
let moreMenu = null;

/* ─── Navigation ─────────────────────────────── */

async function navigate(route) {
  if (!routes[route]) route = "recipes";
  currentRoute = route;
  location.hash = route;

  // Highlight all nav buttons
  const moreRoutes = ["baryga", "minions", "sets", "effects", "safe"];
  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });
  // Highlight "More" button if route is in dropdown
  if (moreBtn) {
    moreBtn.classList.toggle("active", moreRoutes.includes(route));
  }

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

/* ─── Themes ──────────────────────────────────── */

const THEMES = [
  { key: "theme-dark",  icon: "🌙", label: "Тёмная"  },
  { key: "theme-neon",  icon: "⚡",  label: "Неон"    },
  { key: "theme-blood", icon: "🩸", label: "Кровь"   },
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
    btn.addEventListener("click", () => {
      navigate(btn.dataset.route);
      closeMoreMenu();
    });
  });

  // More dropdown menu
  moreBtn = document.getElementById("bnavMoreBtn");
  moreMenu = document.getElementById("bnavMoreMenu");
  
  function closeMoreMenu() {
    if (moreMenu) moreMenu.classList.add("hidden");
    const backdrop = document.querySelector(".bnav-backdrop");
    if (backdrop) backdrop.remove();
    if (moreBtn) moreBtn.classList.remove("active");
  }
  
  function openMoreMenu() {
    if (moreMenu) moreMenu.classList.remove("hidden");
    if (moreBtn) moreBtn.classList.add("active");
    // Add backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "bnav-backdrop";
    backdrop.addEventListener("click", closeMoreMenu);
    document.body.appendChild(backdrop);
  }
  
  if (moreBtn) {
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (moreMenu && !moreMenu.classList.contains("hidden")) {
        closeMoreMenu();
      } else {
        openMoreMenu();
      }
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (moreMenu && !moreMenu.classList.contains("hidden")) {
      if (!moreMenu.contains(e.target) && !moreBtn.contains(e.target)) {
        closeMoreMenu();
      }
    }
  });
  
  // Close menu on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMoreMenu();
    }
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
    if (e.ctrlKey && e.key === "9") { e.preventDefault(); navigate("safe"); }

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
