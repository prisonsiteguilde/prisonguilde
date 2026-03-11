import { esc, fmtNum } from "../utils.js";

// ─── DATA ────────────────────────────────────────────────────────
const MINIONS = [
  {
    id: "crowbar-minion",
    name: "Лом",
    desc: "Тяжеловес. Сидел за разборки в общаге, известен тем, что может выдержать удар табуреткой по голове и не моргнуть.",
    img: "https://media.prison.coffee.agency/minions/crowbar/image.png",
    requiredLvl: 1,
    role: "Танк",
    roleIcon: "🛡",
    maxLevel: 10,
    levelPrices: { 1:10, 2:1000, 3:1800, 4:3500, 5:5200, 6:7000, 7:9000, 8:11000, 9:15000, 10:22000 },
    skills: [
      { id:"provocation", name:"Провокация", desc:"Каждые 5 ходов повышается броня, но становится главной целью для врагов", img:"https://media.prison.coffee.agency/skills/common/provocation.png", type:"active", cooldown:5, minLevel:1, target:"self" },
      { id:"crowbar_battle_cry", name:"Боевой клич", desc:"Каждый 6 ход броня всех союзников увеличивается на 5 единицы и действует 3 хода", img:"https://media.prison.coffee.agency/skills/passive/battle_cry.png", type:"active", cooldown:6, minLevel:5, target:"all_teammates" },
      { id:"crowbar_bury", name:"Вколотить", desc:"Каждые 2 хода урон по боссу увеличивается в 1.75 раз, а по остальным врагам в 1.25", img:"https://media.prison.coffee.agency/skills/passive/bury.png", type:"active", cooldown:2, minLevel:10, target:"all_enemies" },
    ],
    stats: {
      1:  { hp:85,  dmgMin:98,  dmgMax:108, armor:3,   resist:0,   eva:0,  acc:1  },
      2:  { hp:90,  dmgMin:100, dmgMax:110, armor:3,   resist:0.5, eva:0,  acc:2  },
      3:  { hp:106, dmgMin:105, dmgMax:115, armor:4,   resist:1,   eva:0,  acc:3  },
      4:  { hp:114, dmgMin:110, dmgMax:120, armor:5,   resist:1.5, eva:0,  acc:4  },
      5:  { hp:122, dmgMin:115, dmgMax:125, armor:6,   resist:2,   eva:0,  acc:5  },
      6:  { hp:130, dmgMin:120, dmgMax:130, armor:7,   resist:2.5, eva:0,  acc:6  },
      7:  { hp:138, dmgMin:125, dmgMax:135, armor:8,   resist:3,   eva:0,  acc:7  },
      8:  { hp:146, dmgMin:130, dmgMax:140, armor:9,   resist:3.5, eva:0,  acc:8  },
      9:  { hp:154, dmgMin:135, dmgMax:145, armor:10,  resist:4,   eva:0,  acc:9  },
      10: { hp:170, dmgMin:145, dmgMax:155, armor:12,  resist:5,   eva:0,  acc:10 },
    },
  },
  {
    id: "oldman-minion",
    name: "Дед",
    desc: "Старожил. Опытный, умный и расчетливый. Сидит давно, знает все схемы и всегда готов подстраховать свою команду.",
    img: "https://media.prison.coffee.agency/minions/oldman/image.png",
    requiredLvl: 11,
    role: "Саппорт",
    roleIcon: "💚",
    maxLevel: 10,
    levelPrices: { 1:500, 2:1500, 3:3000, 4:5500, 5:9000, 6:13000, 7:18000, 8:25000, 9:35000, 10:50000 },
    skills: [
      { id:"oldman_life_lesson", name:"Базар за жизнь", desc:"Каждый 7 ход урон уменьшает урон врага на 20% на 3 хода", img:"https://media.prison.coffee.agency/skills/passive/life_lesson.png", type:"active", cooldown:7, minLevel:1, target:"enemy" },
      { id:"oldman_dont_rush_to_die", name:"Не спеши сдохнуть", desc:"Восполняет союзникам 18% здоровья в течение 3 ходов", img:"https://media.prison.coffee.agency/skills/passive/dont_rush_to_die.png", type:"active", cooldown:null, minLevel:5, target:"all_teammates" },
      { id:"oldman_bequest", name:"Завещание", desc:"После смерти накладывает на всех союзников повышение урона и крита на 10% на 5 ходов", img:"https://media.prison.coffee.agency/skills/passive/bequest.png", type:"passive", cooldown:null, minLevel:10, target:"all_teammates" },
    ],
    stats: {
      1:  { hp:90,  dmgMin:67, dmgMax:73,  armor:3,   resist:1,   eva:10, acc:5  },
      2:  { hp:94,  dmgMin:70, dmgMax:76,  armor:3.5, resist:1.2, eva:10, acc:6  },
      3:  { hp:99,  dmgMin:73, dmgMax:79,  armor:4,   resist:1.4, eva:10, acc:7  },
      4:  { hp:105, dmgMin:76, dmgMax:82,  armor:4.5, resist:1.6, eva:10, acc:8  },
      5:  { hp:110, dmgMin:79, dmgMax:85,  armor:5,   resist:1.8, eva:10, acc:9  },
      6:  { hp:117, dmgMin:82, dmgMax:88,  armor:5.5, resist:2,   eva:10, acc:10 },
      7:  { hp:123, dmgMin:85, dmgMax:91,  armor:6,   resist:2.2, eva:10, acc:11 },
      8:  { hp:130, dmgMin:88, dmgMax:94,  armor:6.5, resist:2.4, eva:10, acc:12 },
      9:  { hp:135, dmgMin:91, dmgMax:97,  armor:7,   resist:2.6, eva:10, acc:13 },
      10: { hp:140, dmgMin:97, dmgMax:103, armor:8,   resist:3,   eva:10, acc:15 },
    },
  },
  {
    id: "psycho-minion",
    name: "Псих",
    desc: "Кличка говорит сама за себя. Полностью отбитый, даже сокамерники стараются держаться от него подальше.",
    img: "https://media.prison.coffee.agency/minions/psycho/image.png",
    requiredLvl: 17,
    role: "Дамагер",
    roleIcon: "⚔️",
    maxLevel: 10,
    levelPrices: { 1:1000, 2:2500, 3:5000, 4:9000, 5:14000, 6:21000, 7:30000, 8:45000, 9:65000, 10:100000 },
    skills: [
      { id:"psycho_pure_chaos", name:"Чистый хаос", desc:"Вероятность крита и кровотечения 33%, но с вероятностью 34% обычный урон будет снижен", img:"https://media.prison.coffee.agency/skills/passive/pure_chaos.png", type:"passive", cooldown:1, minLevel:1, target:"enemy" },
      { id:"psycho_chaotic_dodges", name:"Хаотичные увороты", desc:"У всех союзников повышается уклонение на 10% на 5 ходов", img:"https://media.prison.coffee.agency/skills/passive/chaotic_dodges.png", type:"passive", cooldown:null, minLevel:5, target:"all_teammates" },
      { id:"psycho_got_nuts", name:"Крыша поехала", desc:"При уменьшении здоровья до 30 HP урон увеличивается на 50%, а броня уменьшается на 1", img:"https://media.prison.coffee.agency/skills/passive/got_nuts.png", type:"passive", cooldown:null, minLevel:10, target:"self" },
    ],
    stats: {
      1:  { hp:80,  dmgMin:95,  dmgMax:105, armor:1,   resist:1,   eva:10, acc:10 },
      2:  { hp:84,  dmgMin:110, dmgMax:120, armor:1.8, resist:1.3, eva:12, acc:11 },
      3:  { hp:88,  dmgMin:125, dmgMax:135, armor:2.6, resist:1.6, eva:14, acc:12 },
      4:  { hp:92,  dmgMin:140, dmgMax:150, armor:3.4, resist:1.9, eva:16, acc:13 },
      5:  { hp:96,  dmgMin:155, dmgMax:165, armor:4.2, resist:2.2, eva:18, acc:14 },
      6:  { hp:100, dmgMin:170, dmgMax:180, armor:5,   resist:2.3, eva:20, acc:15 },
      7:  { hp:104, dmgMin:185, dmgMax:195, armor:5.5, resist:2.5, eva:22, acc:16 },
      8:  { hp:108, dmgMin:200, dmgMax:210, armor:6,   resist:2.6, eva:24, acc:17 },
      9:  { hp:112, dmgMin:215, dmgMax:225, armor:6.5, resist:2.8, eva:26, acc:18 },
      10: { hp:120, dmgMin:245, dmgMax:255, armor:7,   resist:3,   eva:30, acc:20 },
    },
  },
];

// ─── RENDER ──────────────────────────────────────────────────────
const TARGET_RU = {
  self: "на себя",
  enemy: "на врага",
  all_teammates: "на всех союзников",
  all_enemies: "на всех врагов",
};

const STAT_COLS = ["hp","dmgMin","armor","resist","eva","acc"];
const STAT_LABELS = { hp:"❤️ HP", dmgMin:"⚔️ Урон", armor:"🛡 Броня", resist:"🔰 Сопр.", eva:"👟 Уклон", acc:"🎯 Точн." };

function formatStatVal(key, st) {
  if (key === "dmgMin") return `${st.dmgMin}–${st.dmgMax}`;
  const v = st[key];
  return (v % 1 !== 0) ? v.toFixed(1) : String(v);
}

export async function renderMinions() {
  const root = document.createElement("div");
  root.className = "minions-page";

  const state = { selected: MINIONS[0].id, level: 1 };

  root.innerHTML = `
    <div class="card">
      <div class="row">
        <div>
          <div class="card-title">👥 ШЕСТЁРКИ</div>
          <div class="card-sub">Статы · Скиллы · Стоимость прокачки</div>
        </div>
        <span class="badge amber">${MINIONS.length} бойца</span>
      </div>
    </div>

    <div class="minions-pick" id="minionPick">
      ${MINIONS.map(m => `
        <div class="minion-pick-card ${m.id === state.selected ? "active" : ""}" data-id="${esc(m.id)}">
          <img src="${esc(m.img)}" class="minion-pick-img" />
          <div class="minion-pick-name">${esc(m.name)}</div>
          <div class="minion-pick-role">${m.roleIcon} ${esc(m.role)}</div>
          <div class="muted" style="font-size:10px;">Ур.${m.requiredLvl}+</div>
        </div>
      `).join("")}
    </div>

    <div class="minions-body" id="minionBody"></div>
  `;

  root.querySelector("#minionPick").addEventListener("click", e => {
    const card = e.target.closest("[data-id]");
    if (!card) return;
    state.selected = card.dataset.id;
    state.level = 1;
    root.querySelectorAll(".minion-pick-card").forEach(c =>
      c.classList.toggle("active", c.dataset.id === state.selected));
    renderBody();
  });

  function renderBody() {
    const m = MINIONS.find(x => x.id === state.selected);
    const st = m.stats[state.level];
    const el = root.querySelector("#minionBody");

    // Суммарная стоимость прокачки до текущего уровня
    let totalCost = 0;
    for (let l = 1; l <= state.level; l++) totalCost += m.levelPrices[l] || 0;

    el.innerHTML = `
      <!-- Шапка -->
      <div class="card minion-detail-head">
        <div class="minion-detail-img-wrap">
          <img src="${esc(m.img)}" class="minion-detail-img" />
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="card-title" style="font-size:20px;">${esc(m.name)}</span>
            <span class="badge" style="background:var(--card2);">${m.roleIcon} ${esc(m.role)}</span>
          </div>
          <div class="muted" style="font-size:11px;margin-top:3px;">Требуется уровень ${m.requiredLvl}+ · Макс. уровень ${m.maxLevel}</div>
          <div class="boss-lore" style="margin-top:8px;">${esc(m.desc)}</div>
        </div>
      </div>

      <!-- Уровень + статы -->
      <div class="card no-accent">
        <div class="row" style="margin-bottom:12px;">
          <div class="card-title" style="font-size:14px;">📊 Статы</div>
          <div class="minion-lvl-stepper">
            <button class="npc-step-btn" id="lvlDown" type="button">−</button>
            <span class="npc-step-val" id="lvlVal">Ур. ${state.level}</span>
            <span class="npc-step-max">/ ${m.maxLevel}</span>
            <button class="npc-step-btn" id="lvlUp" type="button">+</button>
          </div>
        </div>

        <div class="minion-stats-grid" id="minionStats">
          ${STAT_COLS.map(k => `
            <div class="minion-stat-box">
              <div class="minion-stat-label">${STAT_LABELS[k]}</div>
              <div class="minion-stat-val" data-stat="${k}">${formatStatVal(k, st)}</div>
            </div>
          `).join("")}
        </div>

        <div class="minion-hp-bar-wrap">
          <div class="minion-hp-bar">
            <div class="minion-hp-fill" id="hpFill" style="width:${Math.round(st.hp/170*100)}%;"></div>
          </div>
          <span class="muted" style="font-size:10px;">HP: ${st.hp}</span>
        </div>

        <div class="hr" style="margin:12px 0;"></div>

        <!-- Таблица прокачки -->
        <div class="card-title" style="font-size:13px;margin-bottom:8px;">💰 Стоимость прокачки</div>
        <div class="minion-upgrade-table">
          <div class="minion-upgrade-head">
            <span>Уровень</span><span>Стоимость</span><span>Итого</span>
          </div>
          ${(() => {
            let cum = 0;
            return Array.from({length:m.maxLevel},(_,i)=>i+1).map(lv => {
              const price = m.levelPrices[lv] || 0;
              cum += price;
              const isCur = lv === state.level;
              return `<div class="minion-upgrade-row ${isCur?"current":""}">
                <span>${isCur ? `<b style="color:var(--amber);">Ур.${lv}</b>` : `Ур.${lv}`}</span>
                <span>${fmtNum(price)} 🚬</span>
                <span class="muted">${fmtNum(cum)} 🚬</span>
              </div>`;
            }).join("");
          })()}
        </div>
      </div>

      <!-- Скиллы -->
      <div class="card no-accent">
        <div class="card-title" style="font-size:14px;margin-bottom:12px;">⚡ Скиллы</div>
        <div class="minion-skills-list">
          ${m.skills.map(sk => {
            const locked = state.level < sk.minLevel;
            return `
              <div class="minion-skill-row ${locked ? "locked" : ""}">
                <div class="minion-skill-ico">
                  <img src="${esc(sk.img)}" class="minion-skill-img" onerror="this.style.display='none'" />
                </div>
                <div class="minion-skill-info">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span class="minion-skill-name">${esc(sk.name)}</span>
                    <span class="minion-skill-badge ${sk.type}">${sk.type === "passive" ? "Пассивный" : "Активный"}</span>
                    ${sk.cooldown ? `<span class="muted" style="font-size:10px;">🔄 ${sk.cooldown} хода</span>` : ""}
                    <span class="muted" style="font-size:10px;">🎯 ${TARGET_RU[sk.target] || sk.target}</span>
                    ${locked ? `<span class="minion-locked-badge">🔒 Ур.${sk.minLevel}</span>` : ""}
                  </div>
                  <div class="minion-skill-desc">${esc(sk.desc)}</div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>
    `;

    // Stepper events
    el.querySelector("#lvlDown").addEventListener("click", () => {
      if (state.level > 1) { state.level--; renderBody(); }
    });
    el.querySelector("#lvlUp").addEventListener("click", () => {
      if (state.level < m.maxLevel) { state.level++; renderBody(); }
    });
  }

  renderBody();
  return root;
}
