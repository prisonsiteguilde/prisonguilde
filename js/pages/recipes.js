// js/pages/recipes.js — v3.0 Enhanced
import { listRecipes } from "../db.js";
import { notify } from "../notify.js";
import { openModal } from "../ui.js";

const LS_INV      = "recipes.inventory.v1";
const LS_LAST     = "recipes.lastViewed.v1";
const LS_RECENT   = "recipes.recent.v1";
const LS_FAVS     = "recipes.favorites.v1";
const LS_COMPACT  = "recipes.compact.v1";

const RARITY = [
  { key: "gray",   label: "⚪️ Серый" },
  { key: "green",  label: "🟢 Зелёный" },
  { key: "blue",   label: "🔵 Синий" },
  { key: "purple", label: "🟣 Фиолетовый" },
];

const RES = {
  metal:  { label: "Металл",   icon: "imagesRecept/metall.png" },
  rags:   { label: "Тряпки",   icon: "imagesRecept/tryapki.png" },
  nails:  { label: "Гвозди",   icon: "imagesRecept/gvozdi.png" },
  soap:   { label: "Мыло",     icon: "imagesRecept/milo.png" },
  rope:   { label: "Верёвки",  icon: "imagesRecept/verevki.png" },
  planks: { label: "Доски",    icon: "imagesRecept/doski.png" },
  blades: { label: "Лезвия",   icon: "imagesRecept/lezvie.png" },
};

const RARITY_ORDER = { gray: 1, green: 2, blue: 3, purple: 4 };

const MULT_PRESETS = [1, 5, 10, 25, 50];

/* ── helpers ───────────────────────────────────── */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function rarityLabel(r) { return RARITY.find(x => x.key === r)?.label || r || "—"; }
function normSearch(s)  { return String(s || "").toLowerCase().trim(); }
function clampQty(x)    { const n = Number(x); return (!Number.isFinite(n) || n < 0) ? 0 : Math.floor(n); }

function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const loadInv      = () => loadLS(LS_INV, {});
const saveInv      = v  => saveLS(LS_INV, v);
const loadFavs     = () => loadLS(LS_FAVS, []);
const saveFavs     = v  => saveLS(LS_FAVS, v);
const isCompact    = () => loadLS(LS_COMPACT, true);
const setCompact   = v  => saveLS(LS_COMPACT, v);

function toggleFav(id) {
  const f = loadFavs();
  const i = f.indexOf(id);
  if (i >= 0) f.splice(i, 1); else f.push(id);
  saveFavs(f);
}

function iconBox(src, alt) {
  const s = esc(src || "");
  const a = esc(alt || "");
  return `<div class="rcp-icoBox" role="img" aria-label="${a}" data-src="${s}"></div>`;
}

function applyIconBoxes(scope) {
  scope.querySelectorAll(".rcp-icoBox").forEach(el => {
    const src = el.getAttribute("data-src") || "";
    if (!src) { el.classList.add("is-missing"); return; }
    el.style.backgroundImage = `url("${src}")`;
  });
}

function keyLabel(k)   { return RES[k]?.label || k; }
function rarClass(r)   { return r && r.rarity ? `rar-${String(r.rarity)}` : ""; }
function rarDot(r)     {
  const key = String(r || "");
  return `<span class="rcp-dot r-${esc(key)}" title="${esc(rarityLabel(key))}"></span>`;
}

function baseNameOf(r) {
  return String(r?.name || r?.id || "")
    .replace(/\s*(серый|серая|зелёный|зелёная|синий|синяя|фиолетовый|фиолетовая|gray|green|blue|purple)\s*$/i, "")
    .trim();
}

function sumBase(recipeId, byId, mult = 1, visiting = new Set()) {
  const r = byId.get(recipeId);
  if (!r || visiting.has(recipeId)) return {};
  visiting.add(recipeId);
  const out = {};
  for (const it of (r.ingredients || [])) {
    const qty = clampQty(it.qty) * mult;
    if (!qty) continue;
    if (it.kind === "resource") {
      const k = String(it.key || "");
      if (k) out[k] = (out[k] || 0) + qty;
    } else if (it.kind === "item") {
      const cId = String(it.recipeId || "");
      if (cId) {
        const child = sumBase(cId, byId, qty, visiting);
        for (const k of Object.keys(child)) out[k] = (out[k] || 0) + child[k];
      }
    }
  }
  visiting.delete(recipeId);
  return out;
}

function canCraftWith(recipeId, byId, inv) {
  const sum = sumBase(recipeId, byId, 1);
  return Object.keys(sum).every(k => clampQty(inv[k] ?? 0) >= clampQty(sum[k]));
}

function loadRecent() { return loadLS(LS_RECENT, []); }
function pushRecent(id) {
  const cur = loadRecent().filter(x => x !== id);
  cur.unshift(id);
  saveLS(LS_RECENT, cur.slice(0, 5));
}

/* ── main export ───────────────────────────────── */
export async function renderRecipes() {
  const root = document.createElement("div");
  root.className = "recipes-page";

  const state = {
    recipes: [],
    byId: new Map(),
    hist: [], histIdx: -1,
    q: "", rar: "", catType: "",
    selected: null,
    compact: isCompact(),
  };

  /* ── shell HTML ────────────────────────────── */
  function buildShell() {
    const favCount = loadFavs().length;

    root.innerHTML = `
      <!-- Controls card -->
      <div class="card no-accent" style="padding:16px 20px;">
        <div class="row" style="gap:10px;">
          <div class="search-wrap" style="flex:1;">
            <span class="search-icon">🔍</span>
            <input class="input" id="q" placeholder="Поиск рецепта..." autocomplete="off" />
            <span class="kbd-hint">Ctrl+K</span>
          </div>
          <select class="input" id="rar" style="width:160px;">
            <option value="">Все редкости</option>
            ${RARITY.map(r => `<option value="${r.key}">${r.label}</option>`).join("")}
          </select>
          <button class="btn sm" id="compactToggle" title="Режим отображения">
            ${state.compact ? "📋 Обычный" : "📑 Компактный"}
          </button>
          <button class="btn sm" id="invBtn">📦 Ресурсы</button>
        </div>

        <div class="rcp-chipbar" style="margin-top:12px;">
          <button class="rcp-chip" id="cAll"    type="button">🗂 Все</button>
          <button class="rcp-chip" id="cFav"    type="button">⭐ Избранное${favCount > 0 ? `<span class="fav-count">${favCount}</span>` : ""}</button>
          <button class="rcp-chip" id="cCraft"  type="button">✅ Могу скрафтить</button>
          <button class="rcp-chip" id="cWeapon" type="button">⚔️ Оружие</button>
          <button class="rcp-chip" id="cCons"   type="button">💊 Расходники</button>
          <button class="rcp-chip" id="cOther"  type="button">📦 Прочее</button>
        </div>
      </div>

      <!-- Main layout -->
      <div class="rcp-layout">

        <!-- Left: catalog -->
        <div class="card rcp-left no-accent" style="padding:0;">
          <div class="rcp-left-head">
            <div class="row" style="padding-bottom:8px;">
              <div class="section-title" style="margin:0;">КАТАЛОГ</div>
              <span class="badge" id="cnt">0</span>
            </div>
          </div>
          <div id="grid"></div>
        </div>

        <!-- Right: detail -->
        <div class="card rcp-right" style="padding:0;">
          <div class="rcp-right-head">
            <div style="min-width:0; flex:1;">
              <div class="card-title" id="ttl" style="font-size:22px;">Выберите рецепт</div>
              <div class="muted" id="sub">Кликните по предмету слева</div>
            </div>
            <div class="nav-btns">
              <button class="btn sm" id="back" disabled title="Назад (Alt+←)">←</button>
              <button class="btn sm" id="fwd"  disabled title="Вперёд (Alt+→)">→</button>
            </div>
          </div>
          <div class="hr" style="margin:12px 0;"></div>
          <div class="rcp-right-body">
            <div id="pane" class="muted">Нет выбранного рецепта.</div>
          </div>
        </div>

      </div>
    `;

    /* ── bind controls ─────────────────────── */
    const qEl  = root.querySelector("#q");
    const rarEl = root.querySelector("#rar");
    qEl.value  = state.q;
    rarEl.value = state.rar;

    qEl.addEventListener("input", () => {
      clearTimeout(qEl._t);
      qEl._t = setTimeout(() => { state.q = qEl.value; renderCatalog(); }, 140);
    });
    rarEl.addEventListener("change", () => { state.rar = rarEl.value; renderCatalog(); });

    // Chips
    const chipMap = {
      cAll: "", cFav: "favorites", cCraft: "cancaft",
      cWeapon: "weapon", cCons: "consumable", cOther: "other"
    };
    const refreshChips = () => {
      Object.entries(chipMap).forEach(([id, type]) => {
        root.querySelector(`#${id}`)?.classList.toggle("active", state.catType === type);
      });
    };
    Object.entries(chipMap).forEach(([id, type]) => {
      root.querySelector(`#${id}`)?.addEventListener("click", () => {
        state.catType = type;
        refreshChips();
        renderCatalog();
      });
    });
    refreshChips();

    root.querySelector("#back").addEventListener("click", () => {
      if (state.histIdx <= 0) return;
      state.histIdx--;
      renderRecipe(state.hist[state.histIdx], { push: false });
      updateNav();
    });
    root.querySelector("#fwd").addEventListener("click", () => {
      if (state.histIdx >= state.hist.length - 1) return;
      state.histIdx++;
      renderRecipe(state.hist[state.histIdx], { push: false });
      updateNav();
    });

    root.querySelector("#invBtn").addEventListener("click", openInvModal);
    root.querySelector("#compactToggle").addEventListener("click", () => {
      state.compact = !state.compact;
      setCompact(state.compact);
      root.querySelector("#compactToggle").textContent = state.compact ? "📋 Обычный" : "📑 Компактный";
      renderCatalog();
      if (state.selected) setActiveInCatalog(state.selected);
    });
  }

  /* ── navigation ────────────────────────────── */
  function updateNav() {
    const back = root.querySelector("#back");
    const fwd  = root.querySelector("#fwd");
    if (back) back.disabled = state.histIdx <= 0;
    if (fwd)  fwd.disabled  = state.histIdx >= state.hist.length - 1;
  }

  function pushHist(id) {
    state.hist = state.hist.slice(0, state.histIdx + 1);
    state.hist.push(id);
    state.histIdx = state.hist.length - 1;
    saveLS(LS_LAST, id);
    updateNav();
  }

  function setActiveInCatalog(recipeId) {
    const grid = root.querySelector("#grid");
    if (!grid) return;
    grid.querySelectorAll(".rcp-variant.active").forEach(x => x.classList.remove("active"));
    const btn = grid.querySelector(`.rcp-variant[data-recipe="${CSS.escape(recipeId)}"]`);
    if (btn) { btn.classList.add("active"); btn.scrollIntoView({ block: "nearest" }); }
  }

  /* ── filter ─────────────────────────────────── */
  function filterRecipes() {
    const q   = normSearch(state.q);
    const rar = state.rar || "";
    const inv = loadInv();
    let list  = state.recipes.filter(r => !r.hidden);

    if (rar)    list = list.filter(r => r.rarity === rar);
    if (q)      list = list.filter(r => normSearch(r.name).includes(q) || normSearch(r.id).includes(q));

    const ct = state.catType;
    if      (ct === "favorites") list = list.filter(r => loadFavs().includes(r.id));
    else if (ct === "cancaft")   list = list.filter(r => canCraftWith(r.id, state.byId, inv));
    else if (ct)                 list = list.filter(r => r.type === ct);

    list.sort((a, b) => {
      const n = baseNameOf(a).localeCompare(baseNameOf(b), "ru");
      return n !== 0 ? n : (RARITY_ORDER[a.rarity] || 99) - (RARITY_ORDER[b.rarity] || 99);
    });
    return list;
  }

  /* ── catalog render ─────────────────────────── */
  function renderCatalog() {
    const grid = root.querySelector("#grid");
    const cnt  = root.querySelector("#cnt");
    const list = filterRecipes();
    const favs = loadFavs();

    if (cnt) cnt.textContent = String(list.length);

    const favBtn = root.querySelector("#cFav");
    if (favBtn) {
      const fc = loadFavs().length;
      favBtn.innerHTML = `⭐ Избранное${fc > 0 ? `<span class="fav-count">${fc}</span>` : ""}`;
    }

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Ничего не найдено</div></div>`;
      return;
    }

    // Recent items strip
    const recentIds = loadRecent().filter(id => state.byId.has(id));
    const recentHtml = recentIds.length ? `
      <div class="rcp-recent">
        <div class="rcp-recent-title">
          <span>🕐 Недавние</span>
          <button class="btn sm" id="recentClear" type="button" style="width:auto;font-size:10px;padding:3px 8px;">Очистить</button>
        </div>
        <div class="rcp-recent-row">
          ${recentIds.map(id => {
            const r = state.byId.get(id);
            return `<div class="rcp-recent-item ${rarClass(r)}" data-recipe="${esc(id)}">
              ${iconBox(r?.icon, r?.name || id)}
              <div class="t">${esc(r?.name || id)}</div>
            </div>`;
          }).join("")}
        </div>
      </div>
    ` : "";

    // Group by base name
    const groups = new Map();
    for (const r of list) {
      const key = baseNameOf(r) || r.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(r);
    }
    const groupNames = Array.from(groups.keys()).sort((a,b) => a.localeCompare(b, "ru"));

    // Auto-expand all groups when searching
    const forceOpen = !!state.q || !!state.rar || !!state.catType;

    const groupsHtml = groupNames.map(name => {
      const items = groups.get(name).slice().sort((a,b) =>
        (RARITY_ORDER[a.rarity] || 99) - (RARITY_ORDER[b.rarity] || 99) ||
        String(a.id || "").localeCompare(String(b.id || ""))
      );
      const head = items[0];
      const isOpen = forceOpen || items.some(r => r.id === state.selected);
      const inv = loadInv();

      if (state.compact) {
        return items.map(r => {
          const isFav = favs.includes(r.id);
          const craftable = canCraftWith(r.id, state.byId, inv);
          return `
            <button class="rcp-variant compact ${rarClass(r)} ${state.selected === r.id ? "active" : ""}"
              type="button" data-recipe="${esc(r.id)}">
              <div class="rcp-variant-left">
                <div class="rcp-variant-ico">${iconBox(r.icon, r.name)}</div>
                <div class="rcp-variant-name">${esc(r.name || r.id)}</div>
              </div>
              <div class="rcp-variant-right">
                ${craftable ? '<span title="Можно скрафтить" style="font-size:11px;">✅</span>' : ""}
                <span class="btn-fav ${isFav ? 'active' : ''}" data-fav="${esc(r.id)}">${isFav ? '⭐' : '☆'}</span>
                ${r.type !== "consumable" ? rarDot(r.rarity) : ""}
              </div>
            </button>`;
        }).join("");
      }

      return `
        <div class="rcp-catGroup ${isOpen ? "open" : ""}" data-group="${esc(name)}">
          <div class="rcp-catHead" data-group-toggle="${esc(name)}">
            <div class="rcp-catLeft">
              <div class="rcp-catIco">${iconBox(head.icon, head.name || name)}</div>
              <div class="rcp-catMeta">
                <div class="rcp-catTitle">${esc(name)}</div>
                <div class="rcp-catSub">${esc(head.type || "")} · ${items.length} вар.</div>
              </div>
            </div>
            <span class="badge">${items.length}</span>
          </div>
          <div class="rcp-catBody">
            ${items.map(r => {
              const isFav = favs.includes(r.id);
              const craftable = canCraftWith(r.id, state.byId, inv);
              return `
                <button class="rcp-variant ${rarClass(r)} ${state.selected === r.id ? "active" : ""}"
                  type="button" data-recipe="${esc(r.id)}">
                  <div class="rcp-variant-left">
                    <div class="rcp-variant-ico">${iconBox(r.icon, r.name)}</div>
                    <div class="rcp-variant-name">${esc(r.name || r.id)}</div>
                  </div>
                  <div class="rcp-variant-right">
                    ${craftable ? '<span title="Можно скрафтить" style="font-size:11px;">✅</span>' : ""}
                    <span class="btn-fav ${isFav ? 'active' : ''}" data-fav="${esc(r.id)}">${isFav ? '⭐' : '☆'}</span>
                    ${r.type !== "consumable" ? rarDot(r.rarity) : ""}
                  </div>
                </button>`;
            }).join("")}
          </div>
        </div>`;
    }).join("");

    grid.innerHTML = recentHtml + groupsHtml;
    applyIconBoxes(grid);

    grid.querySelector("#recentClear")?.addEventListener("click", () => {
      saveLS(LS_RECENT, []);
      renderCatalog();
    });

    grid.querySelectorAll("[data-group-toggle]").forEach(h => {
      h.addEventListener("click", () => {
        const key = h.getAttribute("data-group-toggle");
        const box = grid.querySelector(`.rcp-catGroup[data-group="${CSS.escape(key)}"]`);
        box?.classList.toggle("open");
      });
    });

    grid.querySelectorAll("[data-fav]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation(); e.preventDefault();
        toggleFav(btn.getAttribute("data-fav"));
        renderCatalog();
        if (state.selected) setActiveInCatalog(state.selected);
      });
    });
  }

  /* ── recipe detail ──────────────────────────── */
  function renderRecipe(recipeId, { push }) {
    const pane = root.querySelector("#pane");
    const ttl  = root.querySelector("#ttl");
    const sub  = root.querySelector("#sub");

    const r = state.byId.get(recipeId);
    if (!r) {
      ttl.textContent = "Рецепт не найден";
      sub.textContent = recipeId;
      pane.innerHTML = `<div class="muted">Нет данных.</div>`;
      return;
    }

    state.selected = recipeId;
    setActiveInCatalog(recipeId);
    if (push) pushHist(recipeId);
    pushRecent(recipeId);
    renderCatalog();
    setActiveInCatalog(recipeId);

    ttl.textContent = r.name || r.id;
    sub.textContent = r.type === "consumable"
      ? (r.type || "—")
      : `${rarityLabel(r.rarity)} · ${r.type || "—"}`;

    renderPane(r);
    updateNav();
  }

  function renderPane(r) {
    const pane = root.querySelector("#pane");
    const ing  = Array.isArray(r.ingredients) ? r.ingredients : [];
    const inv  = loadInv();
    const sum  = sumBase(r.id, state.byId, 1);

    /* Ingredients list */
    const ingsHtml = ing.length ? ing.map(it => {
      const qty = clampQty(it.qty);
      if (it.kind === "resource") {
        const k = String(it.key || "");
        return `
          <div class="rcp-ing">
            <div class="rcp-ing-ico">${iconBox(RES[k]?.icon, keyLabel(k))}</div>
            <div class="rcp-ing-meta">
              <div class="rcp-ing-name">${esc(keyLabel(k))}</div>
              <div class="rcp-ing-qty">× ${qty}</div>
            </div>
          </div>`;
      }
      if (it.kind === "item") {
        const cId   = String(it.recipeId || "");
        const child = state.byId.get(cId);
        return `
          <button class="rcp-ing ${rarClass(child)}" type="button" data-jump="${esc(cId)}">
            <div class="rcp-ing-ico">${iconBox(child?.icon, child?.name || cId)}</div>
            <div class="rcp-ing-meta">
              <div class="rcp-ing-name">${esc(child?.name || cId)}</div>
              <div class="rcp-ing-qty">× ${qty} · <span style="color:var(--blue);font-size:11px;">открыть рецепт →</span></div>
            </div>
          </button>`;
      }
      return "";
    }).join("") : `<div class="muted">Ингредиенты не указаны</div>`;

    /* Summary rows */
    const totalHave  = Object.keys(sum).filter(k => clampQty(inv[k] ?? 0) >= clampQty(sum[k])).length;
    const totalNeed  = Object.keys(sum).length;
    const allOk      = totalHave === totalNeed && totalNeed > 0;

    const sumHtml = Object.keys(sum).length ? Object.keys(sum).sort().map(k => {
      const need = clampQty(sum[k]);
      const have = clampQty(inv[k] ?? 0);
      const ok   = have >= need;
      const left = ok ? 0 : need - have;
      const pct  = Math.min(100, Math.round((have / need) * 100));
      return `
        <div class="summary-row">
          <div class="summary-row-left">
            <div class="summary-row-ico">${iconBox(RES[k]?.icon, keyLabel(k))}</div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:600; font-size:13px;">${esc(keyLabel(k))}</span>
                <span class="badge ${ok ? "ok" : "bad"}" style="font-size:11px;">
                  ${ok ? `${have}/${need} ✓` : `не хватает ${left}`}
                </span>
              </div>
              <div class="summary-progress" style="margin-top:4px;">
                <div class="summary-progress-fill ${ok ? "" : "bad"}" style="width:${pct}%"></div>
              </div>
            </div>
          </div>
        </div>`;
    }).join("") : `<div class="muted">Нет данных</div>`;

    pane.innerHTML = `
      <!-- Item header -->
      <div class="rcp-main ${rarClass(r)}">
        <div class="rcp-main-ico">
          <div class="rcp-icoBox" data-src="${esc(r.icon || "")}" style="width:100%;height:100%;background-size:contain;background-repeat:no-repeat;background-position:center;"></div>
        </div>
        <div style="flex:1; min-width:0;">
          <div class="rcp-main-name">${esc(r.name || r.id)}</div>
          <div class="rcp-main-sub">
            ${r.type !== "consumable" ? `${esc(rarityLabel(r.rarity))} · ` : ""}${esc(r.type || "—")}
            ${allOk ? " · <span style='color:var(--ok);font-weight:700;'>✅ Можно скрафтить!</span>" : ""}
          </div>
          <div class="rcp-main-actions">
            <button class="btn sm" id="copyBtn">📋 Копировать</button>
            <button class="btn sm" id="shareBtn">🔗 Поделиться</button>
            <button class="btn sm btn-fav-main ${loadFavs().includes(r.id) ? "active" : ""}" id="favBtn">
              ${loadFavs().includes(r.id) ? "⭐ В избранном" : "☆ Избранное"}
            </button>
          </div>
        </div>
      </div>

      <!-- Ingredients -->
      <div class="section-title">🔧 ИНГРЕДИЕНТЫ</div>
      <div class="rcp-ings" style="margin-bottom:16px;">${ingsHtml}</div>

      <div class="hr"></div>

      <!-- Summary -->
      <div class="row" style="margin-bottom:12px;">
        <div class="section-title" style="margin:0;">📊 СУММАРНО БАЗОВЫЕ РЕСУРСЫ</div>
        <button class="btn sm" id="editInvBtn">✏️ Мои ресурсы</button>
      </div>
      <div id="sumRows">${sumHtml}</div>

      ${r.notes ? `
        <div class="hr"></div>
        <div class="section-title">📝 ЗАМЕТКА</div>
        <div class="muted" style="white-space:pre-wrap;">${esc(r.notes)}</div>
      ` : ""}
    `;

    // Apply icons
    applyIconBoxes(pane);

    // Actions
    pane.querySelector("#editInvBtn")?.addEventListener("click", () => openInvModal(r));
    pane.querySelector("#favBtn")?.addEventListener("click", () => {
      toggleFav(r.id);
      renderPane(r);
      renderCatalog();
    });

    pane.querySelector("#shareBtn")?.addEventListener("click", () => {
      const url = `${location.href.split("#")[0]}#recipes?id=${encodeURIComponent(r.id)}`;
      navigator.clipboard.writeText(url)
        .then(() => notify("ok", "Ссылка скопирована", r.name || r.id))
        .catch(() => notify("bad", "Ошибка", "Не удалось скопировать"));
    });

    pane.querySelector("#copyBtn")?.addEventListener("click", () => {
      const sumData = sumBase(r.id, state.byId, state.mult);
      const lines = [`📋 ${r.name || r.id}${state.mult > 1 ? ` ×${state.mult}` : ""}`, ""];
      lines.push("🔧 Ингредиенты:");
      for (const it of (r.ingredients || [])) {
        const qty = clampQty(it.qty) * state.mult;
        if (it.kind === "resource") lines.push(`  • ${keyLabel(it.key)}: ${qty}`);
        else if (it.kind === "item") {
          const child = state.byId.get(it.recipeId || "");
          lines.push(`  • ${child?.name || it.recipeId}: ${qty}`);
        }
      }
      lines.push("", "📊 Базовые ресурсы:");
      for (const k of Object.keys(sumData).sort()) {
        lines.push(`  • ${keyLabel(k)}: ${sumData[k]}`);
      }
      navigator.clipboard.writeText(lines.join("\n"))
        .then(() => notify("ok", "Скопировано!", "Список ингредиентов в буфере"))
        .catch(() => notify("bad", "Ошибка", "Не удалось скопировать"));
    });

    // Jump to child recipe
    pane.querySelectorAll("[data-jump]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-jump");
        if (id) renderRecipe(id, { push: true });
      });
    });
  }

  /* ── inventory modal ────────────────────────── */
  function openInvModal(highlightRecipe) {
    const inv  = loadInv();
    const node = document.createElement("div");
    node.innerHTML = `
      <div class="muted" style="margin-bottom:12px;">💾 Сохраняется в браузере. Используется для расчёта крафта.</div>
    `;

    const form = document.createElement("div");
    form.className = "formgrid";

    for (const k of Object.keys(RES)) {
      const need = highlightRecipe ? clampQty(sumBase(highlightRecipe.id, state.byId, state.mult)[k] || 0) : 0;
      const have = clampQty(inv[k] ?? 0);
      const ok   = !need || have >= need;

      const row = document.createElement("div");
      row.className = "summary-row";
      row.innerHTML = `
        <div class="summary-row-left">
          <div class="summary-row-ico">${iconBox(RES[k].icon, RES[k].label)}</div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span style="font-weight:600;font-size:13px;">${esc(RES[k].label)}</span>
              ${need ? `<span class="badge ${ok ? "ok" : "bad"}" style="font-size:11px;">нужно: ${need}</span>` : ""}
            </div>
          </div>
        </div>
        <input class="input" data-k="${esc(k)}" type="number" min="0" step="1"
          value="${have}" style="width:110px; font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:600; text-align:right;" />
      `;
      applyIconBoxes(row);
      form.appendChild(row);
    }
    node.appendChild(form);

    const btns = document.createElement("div");
    btns.className = "row";
    btns.style.gap = "8px";
    btns.style.marginTop = "12px";
    btns.innerHTML = `
      <div style="display:flex;gap:8px;">
        <button class="btn sm" id="expBtn">↓ Экспорт</button>
        <button class="btn sm" id="impBtn">↑ Импорт</button>
        <button class="btn sm danger" id="clearBtn">🗑 Сбросить</button>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn sm primary" id="saveBtn">💾 Сохранить</button>
      </div>
    `;
    node.appendChild(btns);

    const close = openModal("📦 МОИ РЕСУРСЫ", node);

    const rerender = () => {
      if (state.selected) renderPane(state.byId.get(state.selected));
    };

    node.querySelector("#saveBtn").addEventListener("click", () => {
      const next = {};
      node.querySelectorAll("input[data-k]").forEach(inp => {
        next[inp.dataset.k] = clampQty(inp.value);
      });
      saveInv(next);
      close();
      notify("ok", "Сохранено", "Ресурсы обновлены");
      rerender(); renderCatalog();
    });

    node.querySelector("#clearBtn").addEventListener("click", () => {
      saveInv({});
      close();
      notify("warn", "Сброшено", "Ресурсы очищены");
      rerender(); renderCatalog();
    });

    node.querySelector("#expBtn").addEventListener("click", () => {
      const cur = {};
      node.querySelectorAll("input[data-k]").forEach(i => { cur[i.dataset.k] = clampQty(i.value); });
      navigator.clipboard.writeText(JSON.stringify(cur))
        .then(() => notify("ok", "Экспортировано", "Данные в буфере"))
        .catch(() => notify("bad", "Ошибка", ""));
    });

    node.querySelector("#impBtn").addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        const data = JSON.parse(text);
        node.querySelectorAll("input[data-k]").forEach(i => {
          if (data[i.dataset.k] != null) i.value = clampQty(data[i.dataset.k]);
        });
        notify("ok", "Импортировано", "Проверьте значения и сохраните");
      } catch {
        notify("bad", "Ошибка импорта", "Буфер не содержит данных");
      }
    });
  }

  /* ── event delegation ───────────────────────── */
  root.addEventListener("click", e => {
    const btn = e.target.closest("[data-recipe]");
    if (btn) { const id = btn.getAttribute("data-recipe"); if (id) renderRecipe(id, { push: true }); return; }
    const jump = e.target.closest("[data-jump]");
    if (jump) { const id = jump.getAttribute("data-jump"); if (id) renderRecipe(id, { push: true }); }
  });

  /* ── init ───────────────────────────────────── */
  buildShell();

  try {
    state.recipes = await listRecipes();
  } catch (e) {
    root.querySelector("#grid").innerHTML =
      `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Ошибка загрузки: ${esc(e?.message || String(e))}</div></div>`;
    return root;
  }

  state.byId = new Map(state.recipes.map(r => [r.id, r]));
  renderCatalog();

  // Restore last viewed
  const last = loadLS(LS_LAST, null);
  if (last && state.byId.has(last)) {
    renderRecipe(last, { push: false });
    pushHist(last);
  }

  // Check URL for deep-link: #recipes?id=xxx
  const search = location.hash.split("?")[1] || "";
  const params = new URLSearchParams(search);
  const linkId = params.get("id");
  if (linkId && state.byId.has(linkId)) {
    renderRecipe(linkId, { push: true });
  }

  return root;
}
