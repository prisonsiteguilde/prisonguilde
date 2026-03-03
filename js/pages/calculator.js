// js/pages/calculator.js — v3.1
// NPC hourly rate = base_rate * (1 + respect / 100)
// Capacity = (21000 + 2100 * mining) * viti_mult
// Viti set: +50% NPC speed AND capacity

const NPC_LIST = [
  { name: "Барыга",   sigPerHour:  25, maxCount: 7, icon: "🧢" },
  { name: "Пекарь",   sigPerHour:  40, maxCount: 6, icon: "🍞" },
  { name: "Ткач",     sigPerHour: 110, maxCount: 5, icon: "🧵" },
  { name: "Охранник", sigPerHour:  70, maxCount: 8, icon: "👮" },
  { name: "Слесарь",  sigPerHour: 220, maxCount: 5, icon: "🔧" },
  { name: "Завхоз",   sigPerHour: 140, maxCount: 7, icon: "📦" },
];

const LS_CALC = "calculator.state.v4";

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_CALC) || "{}"); }
  catch { return {}; }
}
function saveState(s) { localStorage.setItem(LS_CALC, JSON.stringify(s)); }

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function fmtNum(n) { return Number(n || 0).toLocaleString("ru-RU"); }
function fmtDec(n, d) { return Number(n || 0).toFixed(d !== undefined ? d : 2).replace(".", ","); }

function getRuPlural(n, f) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return f[2];
  if (b > 1 && b < 5)   return f[1];
  if (b === 1)           return f[0];
  return f[2];
}
function formatTime(totalMin) {
  const t = Math.round(Math.abs(totalMin));
  const h = Math.floor(t / 60), m = t % 60;
  const hw = getRuPlural(h, ["час","часа","часов"]);
  const mw = getRuPlural(m, ["минута","минуты","минут"]);
  if (h === 0) return m + " " + mw;
  if (m === 0) return h + " " + hw;
  return h + " " + hw + " " + m + " " + mw;
}
function parseNum(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function renderCalculator() {
  const root = document.createElement("div");
  root.className = "calc-page";

  const saved = loadState();
  const npcCounts = Object.create(null);
  for (const npc of NPC_LIST) {
    npcCounts[npc.name] = Math.min(npc.maxCount, parseInt(saved.npcs?.[npc.name] || 0, 10));
  }

  let vitiActive = !!saved.viti;

  root.innerHTML = `
    <div class="card">
      <div class="row">
        <div>
          <div class="card-title">🚬 КАЛЬКУЛЯТОР ДОБЫЧИ</div>
          <div class="card-sub">Уважение влияет на скорость шестёрок · Добыча — на вместимость склада</div>
        </div>
        <span class="badge amber">Сиг/мин</span>
      </div>
    </div>

    <div class="calc-two">
      <div style="display:flex;flex-direction:column;gap:16px;">

        <div class="card">
          <div class="section-title">⚙️ ПАРАМЕТРЫ ПЕРСОНАЖА</div>
          <div class="calc-form">
            <div>
              <div class="label">Уважение</div>
              <input class="input" id="respect" type="number" step="0.01" min="0" placeholder="0" value="${esc(saved.respect ?? "0")}" />
              <div class="muted" style="font-size:11px;margin-top:4px;" id="respectHint"></div>
            </div>
            <div>
              <div class="label">Добыча</div>
              <input class="input" id="mining" type="number" step="0.01" min="0" placeholder="0" value="${esc(saved.mining ?? "0")}" />
              <div class="muted" style="font-size:11px;margin-top:4px;" id="miningHint"></div>
            </div>
          </div>
          <div class="hr"></div>
          <div class="viti-toggle" id="vitiToggle">
            <div class="viti-check ${vitiActive ? "on" : ""}" id="vitiCheck">${vitiActive ? "✓" : ""}</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:14px;">⭐ Сет Вити</div>
              <div class="muted" style="font-size:12px;">Увеличивает добычу и вместимость шестёрок на 50%</div>
            </div>
            <span class="badge ${vitiActive ? "amber" : ""}" id="vitiBadge">${vitiActive ? "+50%" : "Выкл"}</span>
          </div>
        </div>

        <div class="card">
          <div class="section-title">👥 ШЕСТЁРКИ</div>
          <div class="muted" style="margin-bottom:12px;font-size:12px;">Скорость = базовая × (1 + уважение / 100)</div>
          <div class="npc-grid" id="npcGrid"></div>
        </div>

      </div>

      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="card">
          <div class="section-title">📊 РЕЗУЛЬТАТЫ</div>
          <div id="result" class="calc-result"><div class="muted">Введи параметры — результаты появятся здесь.</div></div>
        </div>
        <div class="card">
          <div class="section-title">📈 ВКЛАД ШЕСТЁРОК</div>
          <div id="breakdown" class="npc-breakdown"><div class="muted">Нет активных шестёрок.</div></div>
        </div>
      </div>
    </div>
  `;

  // Viti toggle
  root.querySelector("#vitiToggle").addEventListener("click", () => {
    vitiActive = !vitiActive;
    root.querySelector("#vitiCheck").textContent = vitiActive ? "✓" : "";
    root.querySelector("#vitiCheck").classList.toggle("on", vitiActive);
    root.querySelector("#vitiBadge").textContent = vitiActive ? "+50%" : "Выкл";
    root.querySelector("#vitiBadge").className = "badge " + (vitiActive ? "amber" : "");
    calculate();
  });

  // Build NPC rows
  for (const npc of NPC_LIST) {
    const row = document.createElement("div");
    row.className = "npc-item";
    row.innerHTML =
      '<span style="font-size:22px;flex-shrink:0;">' + npc.icon + '</span>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span class="npc-name">' + esc(npc.name) + '</span>' +
          '<span class="muted" style="font-size:11px;">' + npc.sigPerHour + ' баз./ч</span>' +
        '</div>' +
        '<div class="npc-info" id="npcRate-' + esc(npc.name) + '">—</div>' +
        '<div class="npc-bar"><div class="npc-bar-fill" id="bar-' + esc(npc.name) + '" style="width:0%"></div></div>' +
      '</div>' +
      '<select class="input npc-select" data-npc="' + esc(npc.name) + '"></select>';

    const sel = row.querySelector("select");
    for (let i = 0; i <= npc.maxCount; i++) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = i + "/" + npc.maxCount;
      sel.appendChild(opt);
    }
    sel.value = String(npcCounts[npc.name] || 0);
    sel.addEventListener("change", () => {
      npcCounts[npc.name] = Math.max(0, Math.min(npc.maxCount, parseInt(sel.value, 10) || 0));
      calculate();
    });
    root.querySelector("#npcGrid").appendChild(row);
  }

  const $respect = root.querySelector("#respect");
  const $mining  = root.querySelector("#mining");
  $respect.addEventListener("input", calculate);
  $mining.addEventListener("input",  calculate);

  calculate();

  function calculate() {
    const respect  = parseNum($respect.value);
    const mining   = parseNum($mining.value);
    const vitiMult = vitiActive ? 1.5 : 1.0;
    const respMult = 1 + respect / 100;

    saveState({ respect: $respect.value, mining: $mining.value, npcs: { ...npcCounts }, viti: vitiActive });

    const capacity = Math.round((21000 + 2100 * mining) * vitiMult);

    const rHint = root.querySelector("#respectHint");
    const mHint = root.querySelector("#miningHint");
    if (rHint) rHint.textContent = "Множитель шестёрок: ×" + fmtDec(respMult);
    if (mHint) mHint.textContent = "Вместимость: " + fmtNum(capacity) + " сиг";

    const npcSpeeds  = {};
    const npcPerOne  = {};
    let totalSpeed   = 0;

    for (const npc of NPC_LIST) {
      const count  = npcCounts[npc.name] || 0;
      const perOne = npc.sigPerHour * respMult * vitiMult;
      const total  = (perOne * count) / 60;
      npcPerOne[npc.name]  = perOne;
      npcSpeeds[npc.name]  = total;
      totalSpeed += total;

      const rateEl = root.querySelector("#npcRate-" + CSS.escape(npc.name));
      if (rateEl) rateEl.textContent = fmtDec(perOne) + " сиг/ч за 1";
    }

    const safe    = totalSpeed > 0 ? totalSpeed : 0.000001;
    const fillMin = capacity / safe;
    const daily   = Math.round(safe * 1440);
    const fillPct = Math.min(100, (safe * 1440 / capacity) * 100);

    const maxSpd = Math.max(...Object.values(npcSpeeds), 0.001);
    for (const npc of NPC_LIST) {
      const b = root.querySelector("#bar-" + CSS.escape(npc.name));
      if (b) b.style.width = Math.round((npcSpeeds[npc.name] / maxSpd) * 100) + "%";
    }

    root.querySelector("#result").innerHTML =
      '<div class="calc-stat highlight">' +
        '<div><div class="label">Скорость добычи</div></div>' +
        '<div class="value">' + fmtDec(totalSpeed) + ' <span style="font-size:12px;font-weight:400;">сиг/мин</span></div>' +
      '</div>' +
      '<div class="calc-stat">' +
        '<div><div class="label">В час</div></div>' +
        '<div class="value ok">' + fmtNum(Math.round(totalSpeed * 60)) + ' <span style="font-size:12px;font-weight:400;">сиг/ч</span></div>' +
      '</div>' +
      '<div class="calc-stat">' +
        '<div><div class="label">Лимит склада</div>' +
          (vitiActive ? '<div style="font-size:11px;color:var(--amber);">× 1.5 (Сет Вити)</div>' : '') +
        '</div>' +
        '<div class="value">' + fmtNum(capacity) + ' <span style="font-size:12px;font-weight:400;">сиг</span></div>' +
      '</div>' +
      '<div class="calc-stat">' +
        '<div><div class="label">Время до лимита</div></div>' +
        '<div class="value" style="font-size:15px;">' + formatTime(fillMin) + '</div>' +
      '</div>' +
      '<div class="calc-stat highlight">' +
        '<div><div class="label">За 24 часа (без лимита)</div></div>' +
        '<div class="value">' + fmtNum(daily) + ' <span style="font-size:12px;font-weight:400;">сиг/день</span></div>' +
      '</div>' +
      '<div class="fill-bar-wrap">' +
        '<div class="fill-bar-label"><span>Заполнение за 24ч</span><span>' + Math.round(fillPct) + '%</span></div>' +
        '<div class="fill-bar"><div class="fill-bar-inner" style="width:' + Math.min(100, fillPct) + '%;"></div></div>' +
        '<div class="muted" style="font-size:11px;margin-top:5px;text-align:right;">' +
          (fillPct >= 100 ? "✅ Лимит заполняется за " + formatTime(fillMin) : "🕐 До лимита: " + formatTime(fillMin)) +
        '</div>' +
      '</div>';

    const activeNpcs = NPC_LIST.filter(n => (npcCounts[n.name] || 0) > 0);
    if (!activeNpcs.length) {
      root.querySelector("#breakdown").innerHTML = '<div class="muted">Нет активных шестёрок.</div>';
      return;
    }

    root.querySelector("#breakdown").innerHTML = activeNpcs.map(npc => {
      const spd = npcSpeeds[npc.name];
      const pct = Math.round((spd / totalSpeed) * 100);
      const cnt = npcCounts[npc.name];
      const per = npcPerOne[npc.name];
      return '<div class="npc-breakdown-row">' +
        '<span style="font-size:20px;">' + npc.icon + '</span>' +
        '<div class="npc-breakdown-name">' + esc(npc.name) +
          ' <span class="badge" style="font-size:10px;margin-left:3px;">×' + cnt + '</span></div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div class="npc-breakdown-bar-wrap">' +
            '<div class="npc-breakdown-bar" style="width:' + pct + '%;"></div>' +
          '</div>' +
          '<div class="muted" style="font-size:10px;margin-top:2px;">' +
            fmtDec(per) + ' × ' + cnt + ' = ' + fmtNum(Math.round(per * cnt)) + '/ч' +
          '</div>' +
        '</div>' +
        '<div class="npc-breakdown-speed">' + fmtDec(spd) + ' с/м</div>' +
        '<span class="badge" style="min-width:36px;text-align:center;">' + pct + '%</span>' +
      '</div>';
    }).join("");
  }

  return root;
}
