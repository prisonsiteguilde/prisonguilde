// js/app.js
import { renderRecipes } from "./pages/recipes.js";
import { renderCalculator } from "./pages/calculator.js";
import { notify } from "./notify.js";
import { renderAffixes } from "./pages/affixes.js";
import { renderBarygа } from "./pages/baryga.js";

const routes = {
  recipes: renderRecipes,
  calculator: renderCalculator,
  affixes: renderAffixes,
  baryga: renderBarygа,
};

let currentRoute = "recipes";

async function navigate(route) {
  if (!routes[route]) route = "recipes";
  currentRoute = route;
  location.hash = route;


  document.querySelectorAll(".tab[data-route]").forEach((t) => {
    t.classList.toggle("active", t.dataset.route === route);
  });


  document.querySelectorAll(".bnav-btn[data-route]").forEach((t) => {
    t.classList.toggle("active", t.dataset.route === route);
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
    page.appendChild(content);
  } catch (e) {
    console.error(e);
    page.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <div class="empty-text">Ошибка: ${escapeHtml(e?.message || String(e))}</div>
      </div>
    `;
    notify("bad", "Ошибка", e.message || String(e));
  }
}


const THEMES = [
  { key: "theme-dark",  icon: "🌙", label: "Тёмная" },
  { key: "theme-light", icon: "☀️", label: "Светлая" },
];

function cycleTheme() {
  const cur = document.body.className.split(" ").find(c => c.startsWith("theme-")) || "theme-dark";
  const idx = THEMES.findIndex(t => t.key === cur);
  const next = THEMES[(idx + 1) % THEMES.length];
  document.body.className = document.body.className.replace(/theme-\S+/g, "").trim();
  document.body.classList.add(next.key);
  localStorage.setItem("theme", next.key);
  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = next.icon;
}

function applyTheme(key) {
  const theme = THEMES.find(t => t.key === key) || THEMES[0];
  document.body.className = document.body.className.replace(/theme-\S+/g, "").trim();
  document.body.classList.add(theme.key);
  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = theme.icon;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

document.addEventListener("DOMContentLoaded", () => {

  const savedTheme = localStorage.getItem("theme") || "theme-dark";
  applyTheme(savedTheme);
  document.getElementById("themeToggle")?.addEventListener("click", cycleTheme);


  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.route));
  });


  document.addEventListener("keydown", (e) => {

    if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !isInputFocused())) {
      e.preventDefault();
      const searchEl = document.getElementById("q");
      if (searchEl) {
        searchEl.focus();
        searchEl.select();
      }
    }


    if (e.ctrlKey && e.key === "1") { e.preventDefault(); navigate("recipes"); }
    if (e.ctrlKey && e.key === "2") { e.preventDefault(); navigate("calculator"); }


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
