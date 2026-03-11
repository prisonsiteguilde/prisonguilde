import { esc, fmtNum, fmtDec, parseNum, getRuPlural, formatTime } from '../utils.js';

const NPC_LIST = [
  { name: "Барыга",   sigPerHour:  25, maxCount: 7, icon: "🧢" },
  { name: "Пекарь",   sigPerHour:  40, maxCount: 6, icon: "🍞" },
  { name: "Ткач",     sigPerHour: 110, maxCount: 5, icon: "🧵" },
  { name: "Охранник", sigPerHour:  70, maxCount: 8, icon: "👮" },
  { name: "Слесарь",  sigPerHour: 220, maxCount: 5, icon: "🔧" },
  { name: "Завхоз",   sigPerHour: 140, maxCount: 7, icon: "📦" },
];

const LS_CALC = "calculator.state.v5";

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_CALC) || "{}"); }
  catch { return {}; }
}
function saveState(s) { localStorage.setItem(LS_CALC, JSON.stringify(s)); }



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
          <div class="card-sub">Уважение → скорость · Добыча → вместимость склада</div>
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
              <input class="input" id="respect" type="number" step="0.01" min="0" placeholder="0"
                value="${esc(saved.respect ?? "0")}" />
              <div class="muted" style="font-size:11px;margin-top:4px;" id="respectHint"></div>
            </div>
            <div>
              <div class="label">Добыча</div>
              <input class="input" id="mining" type="number" step="0.01" min="0" placeholder="0"
                value="${esc(saved.mining ?? "0")}" />
              <div class="muted" style="font-size:11px;margin-top:4px;" id="miningHint"></div>
            </div>
          </div>
          <div class="hr"></div>
          <div class="viti-toggle" id="vitiToggle">
            <div class="viti-check ${vitiActive ? "on" : ""}" id="vitiCheck">${vitiActive ? "✓" : ""}</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:14px;">⭐ Сет Вити</div>
              <div class="muted" style="font-size:12px;">+50% к скорости и вместимости шестёрок</div>
            </div>
            <span class="badge ${vitiActive ? "amber" : ""}" id="vitiBadge">${vitiActive ? "+50%" : "Выкл"}</span>
          </div>
        </div>

        <div class="card">
          <div class="section-title">👥 ШЕСТЁРКИ</div>
          <div class="muted" style="margin-bottom:12px;font-size:12px;">
            
          </div>
          <div class="npc-grid" id="npcGrid"></div>
        </div>

      </div>

      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="card">
          <div class="section-title">📊 РЕЗУЛЬТАТЫ</div>
          <div id="result" class="calc-result"><div class="muted">Введи параметры.</div></div>
        </div>
        <div class="card">
          <div class="section-title">📦 СКЛАД ПО ШЕСТЁРКАМ</div>
          <div class="muted" style="font-size:11px;margin-bottom:10px;">
            
          </div>
          <div id="breakdown" class="npc-breakdown"><div class="muted">Нет активных шестёрок.</div></div>
        </div>
      </div>
    </div>
  `;


  root.querySelector("#vitiToggle").addEventListener("click", () => {
    vitiActive = !vitiActive;
    root.querySelector("#vitiCheck").textContent = vitiActive ? "✓" : "";
    root.querySelector("#vitiCheck").classList.toggle("on", vitiActive);
    root.querySelector("#vitiBadge").textContent = vitiActive ? "+50%" : "Выкл";
    root.querySelector("#vitiBadge").className = "badge " + (vitiActive ? "amber" : "");
    calculate();
  });


  for (const npc of NPC_LIST) {
    const row = document.createElement("div");
    row.className = "npc-item";
    const curVal = npcCounts[npc.name] || 0;
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
      '<div class="npc-stepper">' +
        '<button class="npc-step-btn" data-dir="-1" data-npc="' + esc(npc.name) + '" type="button">−</button>' +
        '<span class="npc-step-val" id="stepVal-' + esc(npc.name) + '">' + curVal + '<span class="npc-step-max">/' + npc.maxCount + '</span></span>' +
        '<button class="npc-step-btn" data-dir="1" data-npc="' + esc(npc.name) + '" type="button">+</button>' +
      '</div>';

    row.querySelectorAll(".npc-step-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const dir = parseInt(btn.dataset.dir);
        npcCounts[npc.name] = Math.max(0, Math.min(npc.maxCount, (npcCounts[npc.name] || 0) + dir));
        const valEl = row.querySelector("#stepVal-" + CSS.escape(npc.name));
        if (valEl) valEl.firstChild.textContent = npcCounts[npc.name];
        calculate();
      });
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


    const capFactor = (8 + 0.8 * mining) * vitiMult;

    const rHint = root.querySelector("#respectHint");
    const mHint = root.querySelector("#miningHint");
    if (rHint) rHint.textContent = "Множитель скорости: ×" + fmtDec(respMult);
    if (mHint) mHint.textContent = "Фактор склада: " + fmtDec(capFactor) + (vitiActive ? " (с Вити ×1.5)" : "");

    const npcSpeeds   = {}; 
    const npcPerOne   = {};  
    const npcCap      = {}; 
    let totalSpeed    = 0;
    let totalCapacity = 0;

    for (const npc of NPC_LIST) {
      const count  = npcCounts[npc.name] || 0;
      const perOne = npc.sigPerHour * respMult * vitiMult;
      const speed  = (perOne * count) / 60;
      const cap    = count * npc.sigPerHour * capFactor;

      npcPerOne[npc.name] = perOne;
      npcSpeeds[npc.name] = speed;
      npcCap[npc.name]    = cap;
      totalSpeed    += speed;
      totalCapacity += cap;

      const rateEl = root.querySelector("#npcRate-" + CSS.escape(npc.name));
      if (rateEl) rateEl.textContent = fmtDec(perOne) + " сиг/ч × 1";
    }


    const fillMin = totalSpeed > 0 ? totalCapacity / totalSpeed : Infinity;
    const daily   = Math.round(totalSpeed * 1440);

    const timesPerDay = (totalCapacity > 0 && isFinite(fillMin))
      ? 1440 / fillMin
      : 0;

    const maxSpd = Math.max(...Object.values(npcSpeeds), 0.001);
    for (const npc of NPC_LIST) {
      const b = root.querySelector("#bar-" + CSS.escape(npc.name));
      if (b) b.style.width = Math.round((npcSpeeds[npc.name] / maxSpd) * 100) + "%";
    }

    const overflows = isFinite(fillMin) && fillMin < 1440;

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
        '<div><div class="label">Суммарный склад</div>' +
          (vitiActive ? '<div style="font-size:11px;color:var(--amber);">× 1.5 (Сет Вити)</div>' : '') +
        '</div>' +
        '<div class="value">' + fmtNum(Math.round(totalCapacity)) + ' <span style="font-size:12px;font-weight:400;">сиг</span></div>' +
      '</div>' +
      '<div class="calc-stat">' +
        '<div><div class="label">Время заполнения</div></div>' +
        '<div class="value" style="font-size:15px;">' +
          (isFinite(fillMin) ? formatTime(fillMin) : "∞") +
        '</div>' +
      '</div>' +
      '<div class="calc-stat highlight">' +
        '<div><div class="label">За 24 часа (без лимита)</div></div>' +
        '<div class="value">' + fmtNum(daily) + ' <span style="font-size:12px;font-weight:400;">сиг/день</span></div>' +
      '</div>' +
      (isFinite(fillMin) ? (
        '<div class="fill-bar-wrap">' +
          '<div class="fill-bar-label">' +
            '<span>' + (timesPerDay >= 1
              ? '⚠️ Склад заполняется ' + fmtDec(timesPerDay, 1) + ' раз/сут — отжимай чаще!'
              : '🕐 Время до лимита') +
            '</span>' +
            '<span>' + formatTime(fillMin) + '</span>' +
          '</div>' +
          '<div class="fill-bar">' +
            '<div class="fill-bar-inner" style="width:' + Math.min(100, timesPerDay * 100) + '%;background:' +
              (timesPerDay >= 1 ? 'var(--red,#e74c3c)' : 'var(--ok)') + ';"></div>' +
          '</div>' +
        '</div>'
      ) : '');

    const activeNpcs = NPC_LIST.filter(n => (npcCounts[n.name] || 0) > 0);
    if (!activeNpcs.length) {
      root.querySelector("#breakdown").innerHTML = '<div class="muted">Нет активных шестёрок.</div>';
      return;
    }

    root.querySelector("#breakdown").innerHTML = activeNpcs.map(npc => {
      const spd = npcSpeeds[npc.name];
      const cap = npcCap[npc.name];
      const pct = totalSpeed > 0 ? Math.round((spd / totalSpeed) * 100) : 0;
      const cnt = npcCounts[npc.name];
      const per = npcPerOne[npc.name];
      const fillT = spd > 0 ? cap / spd : Infinity;
      return '<div class="npc-breakdown-row">' +
        '<span style="font-size:20px;">' + npc.icon + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="display:flex;align-items:center;gap:5px;">' +
            '<span class="npc-breakdown-name">' + esc(npc.name) + '</span>' +
            '<span class="badge" style="font-size:10px;">×' + cnt + '</span>' +
          '</div>' +
          '<div class="npc-breakdown-bar-wrap">' +
            '<div class="npc-breakdown-bar" style="width:' + pct + '%;"></div>' +
          '</div>' +
          '<div class="muted" style="font-size:10px;margin-top:2px;">' +
            fmtDec(per) + ' × ' + cnt + ' = ' + fmtNum(Math.round(per * cnt)) + ' сиг/ч' +
          '</div>' +
          '<div style="font-size:10px;color:var(--amber);margin-top:1px;">' +
            '📦 ' + fmtNum(Math.round(cap)) + ' сиг · заполн. за ' +
            (isFinite(fillT) ? formatTime(fillT) : "∞") +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0;">' +
          '<div class="npc-breakdown-speed">' + fmtDec(spd) + ' с/м</div>' +
          '<span class="badge" style="min-width:36px;text-align:center;">' + pct + '%</span>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  return root;
}
