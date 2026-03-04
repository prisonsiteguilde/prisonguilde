
const SLOTS = [
  { key: "weapon",  label: "Оружие",    icon: "⚔️",  color: "#E74C3C" },
  { key: "top",     label: "Верх",      icon: "👕",  color: "#E67E22" },
  { key: "pants",   label: "Штаны",     icon: "👖",  color: "#E67E22" },
  { key: "boots",   label: "Обувь",     icon: "👟",  color: "#F1C40F" },
  { key: "head",    label: "Голова",    icon: "🪖",  color: "#F1C40F" },
  { key: "gloves",  label: "Перчатки",  icon: "🥊",  color: "#F1C40F" },
  { key: "glasses", label: "Очки",      icon: "🕶️",  color: "#2ECC71" },
  { key: "watch",   label: "Часы",      icon: "⌚",  color: "#2ECC71" },
  { key: "acc",     label: "Аксессуар", icon: "📿",  color: "#2ECC71" },
  { key: "ring",    label: "Кольцо",    icon: "💍",  color: "#2ECC71" },
  { key: "neck",    label: "Шея",       icon: "📎",  color: "#2ECC71" },
  { key: "bag",     label: "Сумка",     icon: "👜",  color: "#2ECC71" },
];

const CATEGORIES = {
  offense: { label: "⚔️ Атака",    color: "#E74C3C" },
  defense: { label: "🛡 Защита",   color: "#3498DB" },
  utility: { label: "⚡ Утилити",  color: "#9B59B6" },
  brigade: { label: "👥 Бригада",  color: "#2ECC71" },
  special: { label: "✨ Особые",   color: "#F39C12" },
};

const AFFIXES = [
  { id:1,  name:"Урон оружия",                   max:"40%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:2,  name:"Физический урон",               max:"150",  flat:true,  cat:"offense", slots:["weapon"] },
  { id:3,  name:"Шанс крит. удара",              max:"30%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:4,  name:"Урон крит. ударов",             max:"180%", flat:false, cat:"offense", slots:["weapon"] },
  { id:5,  name:"Кровотечение за удар",          max:"10",   flat:true,  cat:"offense", slots:["weapon"] },
  { id:6,  name:"Урон по оглушённым",            max:"25%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:7,  name:"Урон по отравленным",           max:"25%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:8,  name:"Шанс ослабить врага",           max:"24%",  flat:false, cat:"utility", slots:["weapon"] },
  { id:9,  name:"Шанс понизить броню врага",     max:"20%",  flat:false, cat:"utility", slots:["weapon"] },
  { id:10, name:"Шанс понизить меткость врага",  max:"20%",  flat:false, cat:"utility", slots:["weapon"] },
  { id:11, name:"Игнорирование брони",           max:"60%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:12, name:"Урон за 10% недостающего HP",   max:"6%",   flat:false, cat:"offense", slots:["weapon"] },
  { id:13, name:"Урон за живую шестёрку",        max:"24%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:14, name:"Урон по вражеским шестёркам",   max:"45%",  flat:false, cat:"offense", slots:["weapon"] },
  { id:15, name:"Точность",                      max:"4",    flat:true,  cat:"utility", slots:["weapon"] },
  { id:16, name:"Здоровье",                      max:"50",   flat:true,  cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:17, name:"Выносливость",                  max:"30",   flat:true,  cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:18, name:"Выносливость %",                max:"30%",  flat:false, cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:19, name:"Броня",                         max:"13",   flat:true,  cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:20, name:"Броня %",                       max:"35%",  flat:false, cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:21, name:"Уклонение",                     max:"6",    flat:true,  cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:22, name:"Уважение",                      max:"30",   flat:true,  cat:"utility", slots:["top","pants","boots","head","gloves"] },
  { id:23, name:"Уважение %",                    max:"20%",  flat:false, cat:"utility", slots:["top","pants","boots","head","gloves"] },
  { id:24, name:"Шанс блокировки урона",         max:"20%",  flat:false, cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:25, name:"Сопротивление ядам",            max:"20%",  flat:false, cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:26, name:"Сопротивление кровотечению",    max:"20",   flat:true,  cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:27, name:"Общее сопротивление",           max:"4",    flat:true,  cat:"defense", slots:["top","pants","boots","head","gloves"] },
  { id:28, name:"Урон бригады %",                max:"40%",  flat:false, cat:"brigade", slots:["top","pants","boots","head","gloves"] },
  { id:29, name:"Вместимость сумки",             max:"1",    flat:true,  cat:"special", slots:["top","pants"] },
  { id:30, name:"Эффективность расходников %",   max:"40%",  flat:false, cat:"special", slots:["glasses","watch","acc","ring","neck","bag"] },
  { id:31, name:"Восстановление HP за ход",      max:"4",    flat:true,  cat:"special", slots:["glasses","watch","acc","ring","neck","bag"] },
  { id:32, name:"Уклонение при низком HP",       max:"7",    flat:true,  cat:"defense", slots:["glasses","watch","acc","ring","neck","bag"] },
  { id:33, name:"Уклонение бригады %",           max:"40%",  flat:false, cat:"brigade", slots:["glasses","watch","acc","ring","neck","bag"] },
  { id:34, name:"Броня бригады %",               max:"40%",  flat:false, cat:"brigade", slots:["glasses","watch","acc","ring","neck","bag"] },
  { id:35, name:"Здоровье бригады %",            max:"40%",  flat:false, cat:"brigade", slots:["glasses","watch","acc","ring","neck","bag"] },
];

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

export async function renderAffixes() {
  const root = document.createElement("div");
  root.className = "affixes-page";

  const state = { slot: "", search: "", cat: "" };

  const slotBtns = SLOTS.map(s =>
    `<button class="aff-slot-btn" data-slot="${s.key}" type="button"
       style="--sc:${s.color};">${s.icon} ${s.label}</button>`
  ).join("");

  const catBtns = Object.entries(CATEGORIES).map(([k, v]) =>
    `<button class="rcp-chip" data-cat="${k}" type="button"
       style="--cc:${v.color};">${v.label}</button>`
  ).join("");

  root.innerHTML = `
    <div class="card">
      <div class="row">
        <div>
          <div class="card-title">✨ АФФИКСЫ</div>
          <div class="card-sub">Все характеристики предметов · максимальные значения · слоты</div>
        </div>
        <span class="badge amber">${AFFIXES.length} аффиксов</span>
      </div>
    </div>

    <div class="card no-accent" style="padding:14px 16px;">
      <div class="section-title">ФИЛЬТР ПО СЛОТУ</div>
      <div class="aff-slots">
        <button class="aff-slot-btn active" data-slot="" type="button">🎯 Все</button>
        ${slotBtns}
      </div>
      <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;align-items:center;">
        <div class="search-wrap" style="flex:1;min-width:160px;">
          <span class="search-icon">🔍</span>
          <input class="input" id="affSearch" placeholder="Поиск аффикса..." style="padding-left:36px;" />
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="rcp-chip active" data-cat="" type="button">Все</button>
          ${catBtns}
        </div>
      </div>
    </div>

    <div id="affSummary"></div>

    <div class="card" style="padding:0;overflow:hidden;">
      <div id="affTableHead" class="aff-table-head"></div>
      <div id="affTableBody" class="aff-table-body"></div>
    </div>
  `;

  root.querySelectorAll(".aff-slot-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.slot = btn.getAttribute("data-slot");
      root.querySelectorAll(".aff-slot-btn").forEach(b =>
        b.classList.toggle("active", b.getAttribute("data-slot") === state.slot)
      );
      render();
    });
  });

  root.querySelectorAll("[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.cat = btn.getAttribute("data-cat");
      root.querySelectorAll("[data-cat]").forEach(b =>
        b.classList.toggle("active", b.getAttribute("data-cat") === state.cat)
      );
      render();
    });
  });

  const searchEl = root.querySelector("#affSearch");
  searchEl.addEventListener("input", () => {
    clearTimeout(searchEl._t);
    searchEl._t = setTimeout(() => {
      state.search = searchEl.value.toLowerCase().trim();
      render();
    }, 120);
  });

  function filter() {
    return AFFIXES.filter(a => {
      if (state.slot && !a.slots.includes(state.slot)) return false;
      if (state.cat  && a.cat !== state.cat)           return false;
      if (state.search && !a.name.toLowerCase().includes(state.search)) return false;
      return true;
    });
  }

  function render() {
    const list      = filter();
    const showSlots = !state.slot;

    const summary = root.querySelector("#affSummary");
    if (state.slot) {
      const sl = SLOTS.find(s => s.key === state.slot);
      const byCat = {};
      list.forEach(a => { byCat[a.cat] = (byCat[a.cat] || 0) + 1; });
      summary.innerHTML = `
        <div class="card no-accent aff-summary-bar">
          <span style="font-size:28px;">${sl.icon}</span>
          <div>
            <div style="font-weight:700;font-size:15px;">${sl.label}</div>
            <div class="muted" style="font-size:12px;">${list.length} аффиксов доступно</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-left:auto;">
            ${Object.entries(byCat).map(([k,n]) => {
              const c = CATEGORIES[k];
              return `<span class="badge" style="background:${c.color}22;color:${c.color};border-color:${c.color}44;">${c.label} ${n}</span>`;
            }).join("")}
          </div>
        </div>`;
    } else {
      summary.innerHTML = "";
    }

    root.querySelector("#affTableHead").innerHTML = `
      <div class="aff-col-num">#</div>
      <div class="aff-col-cat">Кат.</div>
      <div class="aff-col-name">Аффикс</div>
      <div class="aff-col-max">Макс.</div>
      ${showSlots ? '<div class="aff-col-slots">Слоты</div>' : ""}
    `;

    if (!list.length) {
      root.querySelector("#affTableBody").innerHTML =
        `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Ничего не найдено</div></div>`;
      return;
    }

    const maxColors = { offense:"var(--bad)", defense:"var(--blue2)", brigade:"var(--ok)", utility:"var(--amber2)", special:"var(--amber)" };

    root.querySelector("#affTableBody").innerHTML = list.map(a => {
      const cat    = CATEGORIES[a.cat];
      const slotsH = showSlots ? `<div class="aff-col-slots">${
        a.slots.map(sk => {
          const sl = SLOTS.find(s => s.key === sk);
          return `<span class="aff-slot-tag" style="--sc:${sl.color};" title="${sl.label}">${sl.icon}</span>`;
        }).join("")
      }</div>` : "";

      return `
        <div class="aff-row">
          <div class="aff-col-num">${a.id}</div>
          <div class="aff-col-cat">
            <span class="aff-cat-badge" style="background:${cat.color}22;color:${cat.color};border-color:${cat.color}44;">
              ${cat.label.split(" ")[0]}
            </span>
          </div>
          <div class="aff-col-name">
            <span class="aff-name-text">${esc(a.name)}</span>
            ${a.flat
              ? '<span class="aff-tag aff-tag-flat">плоск.</span>'
              : '<span class="aff-tag aff-tag-pct">%</span>'}
          </div>
          <div class="aff-col-max">
            <span class="aff-max-val" style="color:${maxColors[a.cat] || "var(--text)"};">${esc(a.max)}</span>
            <span class="aff-max-label">макс</span>
          </div>
          ${slotsH}
        </div>`;
    }).join("");
  }

  render();
  return root;
}
