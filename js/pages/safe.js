import { esc } from "../utils.js";

function scoreCode(g, s) {
  let green = 0;
  const gG = [0,0,0,0], sG = [0,0,0,0];
  for (let i = 0; i < 4; i++) {
    if (g[i] === s[i]) { green++; gG[i] = sG[i] = 1; }
  }
  const gSet = new Set(), sSet = new Set();
  for (let i = 0; i < 4; i++) { if (!gG[i]) gSet.add(g[i]); }
  for (let i = 0; i < 4; i++) { if (!sG[i]) sSet.add(s[i]); }
  let yellow = 0;
  for (const d of gSet) { if (sSet.has(d)) yellow++; }
  return { green, yellow, sc: green * 5 + yellow };
}

function filterCodes(possible, guess, sc) {
  return possible.filter(c => scoreCode(guess, c).sc === sc);
}

function findSeparatingGuess(codes) {
  const n = codes.length;
  for (let gi = 0; gi <= 9999; gi++) {
    const g = String(gi).padStart(4, "0");
    const scores = new Set();
    for (let j = 0; j < n; j++) {
      const sc = scoreCode(g, codes[j]).sc;
      if (scores.has(sc)) break;
      scores.add(sc);
    }
    if (scores.size === n) return g;
  }
  return null;
}

function lookaheadBest(possible) {
  const n = possible.length;
  if (n <= 1) return possible[0] ?? "????";
  if (n === 2) return possible[0];
  if (n <= 12) { const sep = findSeparatingGuess(possible); if (sep) return sep; }
  let best = possible[0], bestExp = Infinity;
  for (let gi = 0; gi <= 9999; gi++) {
    const g = String(gi).padStart(4, "0");
    const dist = new Map();
    for (let j = 0; j < n; j++) {
      const k = scoreCode(g, possible[j]).sc;
      dist.set(k, (dist.get(k) || 0) + 1);
    }
    let exp = 0;
    for (const cnt of dist.values()) {
      const p = cnt / n;
      exp += p * (1 + (cnt <= 1 ? 0 : Math.log2(cnt)));
    }
    if (exp < bestExp) { bestExp = exp; best = g; }
  }
  return best;
}

function entropyAll(possible) {
  const n = possible.length;
  const ps = new Set(possible);
  const pe = Math.log2(n);
  let best = possible[0], bestEnt = -1;
  for (let gi = 0; gi <= 9999; gi++) {
    const g = String(gi).padStart(4, "0");
    const dist = new Map();
    for (let j = 0; j < n; j++) {
      const k = scoreCode(g, possible[j]).sc;
      dist.set(k, (dist.get(k) || 0) + 1);
    }
    let ent = 0;
    for (const cnt of dist.values()) { const p = cnt / n; ent -= p * Math.log2(p); }
    if (ps.has(g)) ent += 0.005;
    if (ent > bestEnt) { bestEnt = ent; best = g; }
    if (bestEnt >= pe - 0.001) break;
  }
  return best;
}

function entropyFast(possible) {
  const n = possible.length;
  let best = possible[0], bestEnt = -1;
  for (let i = 0; i < n; i++) {
    const g = possible[i];
    const dist = new Map();
    for (let j = 0; j < n; j++) {
      const k = scoreCode(g, possible[j]).sc;
      dist.set(k, (dist.get(k) || 0) + 1);
    }
    let ent = 0;
    for (const cnt of dist.values()) { const p = cnt / n; ent -= p * Math.log2(p); }
    ent += 0.005;
    if (ent > bestEnt) { bestEnt = ent; best = g; }
  }
  return best;
}

const G1 = "0123";
const L2 = {"0":"4567","1":"4761","2":"1435","3":"1240","4":"1200","5":"0564","6":"0245","7":"0234","8":"0012","10":"0145","11":"0245","12":"0211","15":"0245","20":"0123"};
const L3 = {"0_5":"5988","0_6":"5869","0_10":"4789","0_7":"4686","0_11":"4689","0_15":"4689","0_20":"4567","0_12":"4655","0_8":"4456","0_2":"5789","0_3":"7458","0_4":"5644","0_1":"5889","0_0":"0888","1_6":"1758","1_2":"3547","1_3":"5418","1_11":"1789","1_7":"1758","1_8":"1446","1_4":"1476","1_5":"5268","1_1":"5097","1_10":"5718","1_15":"1568","1_12":"1461","1_0":"5089","1_20":"4761","2_5":"1067","2_6":"1264","2_10":"1604","2_11":"1367","2_7":"3617","2_15":"2365","2_12":"1315","2_8":"1355","2_20":"1435","2_0":"2670","2_1":"3067","2_2":"3640","2_3":"7316","2_4":"3541","3_7":"1502","3_10":"1035","3_6":"1532","3_12":"0002","3_15":"5216","3_11":"1506","3_20":"1240","3_8":"1201","3_3":"2501","3_4":"0012","3_2":"3052","4_7":"0001","4_15":"1230","4_11":"0001","4_3":"2031","5_5":"0789","5_10":"7068","5_6":"0748","5_7":"7458","5_11":"7068","5_15":"4578","5_8":"0456","5_12":"0445","5_20":"0564","5_0":"7893","5_1":"5178","5_2":"4673","5_3":"1653","6_5":"0637","6_6":"0461","6_10":"6208","6_11":"6274","6_7":"0052","6_15":"6742","6_20":"0245","6_12":"0254","6_8":"0452","6_1":"6172","6_2":"6421","6_0":"1673","6_3":"6420","6_4":"0400","7_6":"1132","7_10":"5631","7_11":"5362","7_15":"3560","7_20":"0234","7_7":"1224","7_8":"0012","7_12":"0432","7_2":"1025","7_3":"2053","7_4":"0420","8_7":"0020","8_15":"0312","8_3":"0020","8_11":"2013","10_5":"1627","10_6":"4162","10_10":"0617","10_11":"0034","10_15":"6748","10_20":"0145","10_12":"0154","10_7":"0002","10_0":"2678","10_1":"2467","10_2":"4523","11_5":"6073","11_6":"6721","11_10":"2637","11_11":"0003","11_7":"0024","11_15":"0243","11_1":"1627","11_2":"2164","11_3":"0004","12_7":"0132","12_15":"0213","12_11":"0321","12_3":"0013","15_6":"6172","15_5":"6708","15_7":"0004","15_11":"0125","15_10":"0143","15_1":"1678","15_2":"4123","20_20":"0123"};
const L4 = {"0_5_5":"6469","0_5_1":"9646","0_5_10":"4489","0_5_6":"6888","0_5_2":"9878","0_5_7":"4898","0_6_1":"4748","0_6_2":"4945","0_6_6":"6468","0_6_0":"4044","0_6_5":"4974","0_6_7":"9579","0_6_3":"9548","0_6_11":"4898","0_6_10":"7966","0_6_15":"5658","0_10_6":"4648","0_10_5":"4445","0_10_10":"4459","0_10_7":"4974","0_10_1":"6558","0_10_2":"7866","0_7_10":"4679","0_7_5":"9576","0_7_6":"8575","0_7_1":"7965","0_7_2":"6549","0_7_7":"5466","0_7_3":"5864","0_11_6":"4855","0_11_1":"6556","0_11_2":"5669","0_15_6":"4546","0_2_5":"6468","0_2_6":"7796","0_2_10":"7886","0_2_15":"6797","0_2_7":"8796","0_2_11":"7486","0_2_1":"6494","0_2_2":"7844","0_2_3":"9856","0_3_6":"7649","0_3_10":"7596","0_3_7":"6485","0_3_2":"5679","0_3_3":"6785","0_3_11":"8496","0_1_10":"9896","0_1_11":"8489","0_1_15":"5596","0_1_6":"8949","0_1_7":"9688","0_1_5":"7974","0_1_1":"4944","0_1_2":"8894","1_6_5":"3747","1_6_10":"3457","1_6_6":"3784","1_6_11":"8918","1_6_7":"5651","1_6_15":"0889","1_6_0":"4396","1_6_1":"4907","1_6_2":"8491","1_6_3":"7819","1_2_1":"7608","1_2_2":"8376","1_2_5":"6284","1_2_6":"6387","1_2_10":"5817","1_2_0":"6818","1_2_7":"3684","1_2_3":"7402","1_2_15":"0386","1_2_11":"6337","1_3_10":"1496","1_3_6":"7819","1_3_7":"1688","1_3_11":"1065","1_3_3":"1546","1_3_2":"9684","1_3_5":"6437","1_3_1":"3647","1_11_1":"0465","1_11_2":"4596","1_11_6":"4415","1_7_5":"6164","1_7_6":"1566","1_7_10":"7714","1_7_7":"5714","1_7_1":"4607","1_7_2":"9471","1_7_3":"7681","1_5_1":"4095","1_5_2":"2789","1_5_0":"4049","1_5_10":"5096","1_5_11":"2259","1_5_15":"2259","1_5_7":"2866","1_5_6":"9860","1_5_5":"4389","1_1_1":"3849","1_1_2":"8572","1_1_6":"5680","1_1_0":"8386","1_1_5":"2896","1_1_10":"9387","1_1_3":"7938","1_1_11":"7080","1_1_7":"7089","1_1_15":"7298","1_10_2":"1869","1_10_1":"0945","1_10_10":"7608","1_10_7":"1787","1_10_6":"4872","1_10_5":"2967","1_10_0":"3094","1_15_6":"4409","1_0_1":"2522","1_0_2":"8535","1_0_6":"2599","1_0_5":"8982","1_0_10":"2899","1_0_11":"5500","1_0_3":"8295","1_0_7":"8839","1_0_15":"2005","1_0_8":"5095","1_0_4":"8905","2_5_10":"6281","2_5_11":"6089","2_5_15":"8907","2_5_5":"9281","2_5_6":"1890","2_5_7":"8709","2_5_1":"6832","2_5_0":"2898","2_5_2":"6308","2_6_10":"1047","2_6_6":"1752","2_6_7":"2630","2_6_5":"1507","2_6_15":"2718","2_6_11":"2251","2_6_2":"4710","2_6_1":"5732","2_6_3":"4712","2_6_0":"3075","2_10_10":"0578","2_10_6":"5742","2_10_7":"7048","2_10_5":"7831","2_10_0":"2378","2_10_1":"3472","2_10_2":"3780","2_11_1":"0305","2_7_1":"1054","2_7_6":"3484","2_7_2":"1384","2_7_3":"1356","2_7_7":"1347","2_7_5":"3045","2_7_10":"0489","2_0_10":"8089","2_0_6":"2088","2_0_7":"2806","2_0_11":"8260","2_0_15":"7879","2_0_3":"6082","2_0_2":"8082","2_1_5":"8042","2_1_6":"3872","2_1_10":"3286","2_1_1":"2681","2_1_0":"8812","2_1_11":"1860","2_1_2":"8610","2_1_3":"7801","2_1_15":"0869","2_1_7":"3870","2_2_2":"7014","2_2_1":"4271","2_2_5":"7381","2_2_0":"2751","2_2_6":"7350","2_2_7":"3704","2_2_3":"7804","2_2_10":"3052","2_2_15":"7048","2_2_11":"3078","2_3_5":"4350","2_3_1":"3054","2_3_10":"4081","2_3_6":"8343","2_3_11":"0416","2_3_7":"4361","2_3_2":"0585","2_3_3":"3571","3_7_2":"4330","3_10_10":"0678","3_10_7":"1167","3_10_6":"2336","3_6_11":"2617","3_6_6":"1607","3_6_7":"2336","3_6_2":"2367","3_6_3":"6317","3_2_11":"2067","3_2_7":"2067","3_2_3":"1567","3_2_2":"2617","3_2_6":"3671","3_2_10":"6712","3_2_15":"2607","5_5_5":"1463","5_5_6":"7138","5_5_10":"7708","5_5_7":"0078","5_5_11":"0079","5_5_15":"0079","5_5_0":"5536","5_5_1":"7253","5_5_2":"7294","5_10_5":"6195","5_10_6":"5960","5_10_1":"5590","5_10_2":"9804","5_10_7":"6760","5_6_5":"9096","5_6_10":"7950","5_6_11":"8945","5_6_15":"0408","5_6_6":"0076","5_6_7":"9470","5_6_1":"6924","5_6_0":"5963","5_6_2":"5174","5_7_2":"0672","5_7_1":"6946","5_7_5":"4496","5_7_6":"0376","5_11_1":"0049","5_11_6":"5669","5_11_2":"9507","5_0_1":"1981","5_0_2":"8922","5_0_5":"2171","5_0_6":"8819","5_0_10":"3383","5_0_7":"3783","5_0_11":"3793","5_0_15":"3793","5_0_3":"1778","5_1_6":"9147","5_1_5":"4119","5_1_10":"4918","5_1_7":"7115","5_1_11":"5019","5_1_1":"4983","5_1_0":"4933","5_1_2":"7824","5_1_15":"8958","5_2_1":"5816","5_2_2":"1486","5_2_5":"4815","5_2_6":"5348","5_2_11":"6648","5_2_10":"5638","5_2_7":"4486","6_5_5":"8901","6_5_6":"0710","6_5_10":"6810","6_5_11":"7839","6_5_15":"8397","6_5_7":"8360","6_5_0":"1018","6_5_1":"1483","6_5_2":"2863","6_6_5":"2078","6_6_7":"1084","6_6_6":"4307","6_6_10":"1758","6_6_11":"4430","6_6_15":"4708","6_6_2":"4172","6_6_3":"1044","6_6_1":"7521","6_6_0":"3785","6_10_1":"7035","6_10_7":"6760","6_10_6":"0072","6_10_5":"2373","6_10_2":"5831","6_7_10":"1682","6_7_2":"1415","6_7_7":"2565","6_1_5":"1108","6_1_6":"7180","6_1_10":"8610","6_1_11":"7892","6_1_15":"2879","6_1_1":"5318","6_1_2":"8326","6_1_3":"2781","6_1_7":"2161","6_1_0":"8038","6_2_2":"4710","6_2_1":"1750","6_2_15":"4171","6_2_11":"1084","6_2_6":"3724","6_2_10":"5076","6_2_7":"7326","6_2_5":"7082","6_2_3":"2714","6_2_0":"7058","6_0_6":"3883","6_0_7":"7178","6_0_10":"8919","6_0_11":"1789","6_0_15":"6689","6_0_2":"3818","6_0_3":"3816","6_3_6":"3522","6_3_7":"2784","6_3_15":"2447","6_3_10":"5078","7_6_6":"0607","7_6_2":"5617","7_6_10":"3156","7_6_15":"2567","7_6_3":"2353","7_7_1":"0567","7_7_5":"3056","7_2_10":"6071","7_2_15":"6780","7_2_11":"2067","7_2_7":"0305","7_2_6":"3603","7_2_3":"6702","7_2_2":"6107","7_3_2":"1401","7_3_7":"0062","7_3_3":"3637","10_5_0":"8089","10_5_5":"0208","10_5_6":"8192","10_5_10":"0682","10_5_1":"8730","10_5_7":"6182","10_5_2":"6138","10_6_2":"4478","10_6_0":"5578","10_6_1":"4738","10_6_6":"1728","10_6_5":"1758","10_6_7":"1478","10_6_10":"4738","10_10_5":"8029","10_10_6":"8991","10_10_7":"6860","10_10_10":"1821","10_10_1":"1829","10_0_1":"3233","10_0_2":"7269","10_1_1":"3583","10_1_2":"5268","11_1_2":"2618"};

const REWARDS = [
  { name:"Сигареты",      img:"https://media.prison.coffee.agency/items/valute/cigarettes.webp" },
  { name:"Металл",        img:"imagesRecept/metall.png" },
  { name:"Тряпки",        img:"imagesRecept/tryapki.png" },
  { name:"Гвозди",        img:"imagesRecept/gvozdi.png" },
  { name:"Мыло",          img:"imagesRecept/milo.png" },
  { name:"Верёвки",       img:"imagesRecept/verevki.png" },
  { name:"Дерево",        img:"imagesRecept/doski.png" },
  { name:"Фишка чистки",  img:"https://media.prison.coffee.agency/test455/items/spheres/sphere-removal.png" },
  { name:"Фишка подгона", img:"https://media.prison.coffee.agency/test455/items/spheres/sphere-addition.png" },
  { name:"Фишка замены",  img:"https://media.prison.coffee.agency/items/spheres/sphere-replacement.png" },
  { name:"Фишка жертвы",  img:"https://media.prison.coffee.agency/items/spheres/sphere-sacrifice.png" },
  { name:"Часы",          img:"https://media.prison.coffee.agency/test455/items/other/pocket_watch.png" },
];

const CYCLE = ["gray","yellow","green"];
const SYM   = { gray:"✕", yellow:"◑", green:"✓" };
const LS_ATT  = "safe_att_v14";
const LS_OPEN = "safe_open_v14";

export function renderSafe() {
  const root = document.createElement("div");
  root.className = "page-content";

  let possible = null;
  let attempts = [];
  let solved   = false;
  let dayTimer = null;
  const dColors = ["gray","gray","gray","gray"];
  const dVals   = ["","","",""];

  try {
    const sv = JSON.parse(localStorage.getItem(LS_ATT) || "null");
    if (sv?.date === todayKey()) {
      attempts = sv.attempts || [];
      if (attempts.length) {
        possible = buildAll();
        for (const a of attempts) possible = filterCodes(possible, a.guess, a.green * 5 + a.yellow);
      }
      solved = attempts.some(a => a.green === 4);
    }
  } catch(e) {}

  function todayKey() { return new Date().toISOString().slice(0,10); }
  function isOpened() { return localStorage.getItem(LS_OPEN) === todayKey(); }
  function buildAll() { const a=[]; for(let i=0;i<=9999;i++) a.push(String(i).padStart(4,"0")); return a; }
  function getPoss()  { if (!possible) possible = buildAll(); return possible; }
  function getPLen()  { return possible ? possible.length : 10000; }

  function getNextGuess() {
    const pl = getPLen();
    if (pl === 10000) return G1;
    if (pl === 0)     return "????";
    if (pl === 1)     return getPoss()[0];
    if (pl === 2)     return getPoss()[0];

    const na = attempts.length;
    const p  = getPoss();

    if (na === 1) {
      const s = attempts[0].green * 5 + attempts[0].yellow;
      if (L2[s] !== undefined) return L2[s];
    }
    if (na === 2) {
      const s0 = attempts[0].green * 5 + attempts[0].yellow;
      const s1 = attempts[1].green * 5 + attempts[1].yellow;
      if (L3[`${s0}_${s1}`] !== undefined) return L3[`${s0}_${s1}`];
    }
    if (na === 3) {
      const s0 = attempts[0].green * 5 + attempts[0].yellow;
      const s1 = attempts[1].green * 5 + attempts[1].yellow;
      const s2 = attempts[2].green * 5 + attempts[2].yellow;
      if (L4[`${s0}_${s1}_${s2}`] !== undefined) return L4[`${s0}_${s1}_${s2}`];
    }

    if (pl <= 20)  return lookaheadBest(p);
    if (pl <= 200) return entropyAll(p);
    return entropyFast(p);
  }

  root.innerHTML = `
<div class="sf-wrap">
  <div class="sf-top">
    <div class="sf-top-l">
      <span class="sf-icon" id="sfIcon">🔒</span>
      <div>
        <div class="sf-title">СЕЙФ</div>
        <div class="sf-variants" id="sfVar">10 000 вариантов</div>
      </div>
    </div>
    <div id="sfBadge"></div>
  </div>
  <div class="sf-legend">
    <span class="sf-leg green"><span class="sf-leg-d"></span>точное место</span>
    <span class="sf-leg yellow"><span class="sf-leg-d"></span>есть, не там</span>
    <span class="sf-leg gray"><span class="sf-leg-d"></span>нет в коде</span>
  </div>
  <div class="sf-solver" id="sfSolver">
    <div class="sf-code-label">↓ Введи в игре ↓</div>
    <div class="sf-tiles" id="sfTiles">
      ${[0,1,2,3].map(i => `
        <button class="sf-tile gray" id="sfT${i}" data-pos="${i}" type="button">
          <span class="sf-pos">${i+1}</span>
          <span class="sf-td" id="sfD${i}">?</span>
          <span class="sf-ts" id="sfS${i}">✕</span>
        </button>
      `).join("")}
    </div>
    <div class="sf-tap-hint">👆 Тапни плитку → смени цвет</div>
    <div class="sf-prog-track"><div class="sf-prog-fill" id="sfProg"></div></div>
    <div class="sf-prog-label" id="sfProgLabel"></div>
    <button class="sf-apply" id="sfApply" disabled>✓ Применить</button>
    <button class="sf-reset-full" id="sfResetBtn" type="button">↺ Начать заново</button>
  </div>
  <div class="sf-solved" id="sfSolved" style="display:none">
    <div class="sf-solved-e">🔓</div>
    <div class="sf-solved-t">ОТКРЫТ!</div>
    <div class="sf-solved-s" id="sfSolvedS"></div>
    <button class="sf-apply" id="sfMarkOpen" style="margin-top:12px;">✅ Отметить как открытый сегодня</button>
    <button class="sf-reset-full" id="sfResetFromSolved" style="margin-top:8px;">↺ Новая попытка</button>
  </div>
  <div class="sf-done" id="sfDone" style="display:none">
    <div class="sf-done-e">✅</div>
    <div class="sf-done-t">Сегодня открыт!</div>
    <div class="sf-done-next">Следующий через</div>
    <div class="sf-done-timer" id="sfDoneT">--:--:--</div>
    <button class="sf-reset-full" id="sfUnmark" style="margin-top:10px;">Сбросить отметку</button>
  </div>
  <div class="sf-hist-wrap">
    <div class="sf-sec-title">
      <span>📊 История попыток</span>
      <span class="sf-att-ct" id="sfAttCt"></span>
    </div>
    <div id="sfHist"></div>
  </div>
  <div class="sf-rews-wrap">
    <div class="sf-sec-title"><span>🎁 Возможные призы</span></div>
    <div class="sf-rews">
      ${REWARDS.map(r => `
        <div class="sf-rew">
          <img class="sf-rew-img" src="${esc(r.img)}" alt="${esc(r.name)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='inline';" />
          <span class="sf-rew-fb" style="display:none">📦</span>
          <span>${esc(r.name)}</span>
        </div>
      `).join("")}
    </div>
  </div>
</div>`;

  const $ = id => root.querySelector(id);
  const sfApply = $("#sfApply");
  const sfResetBtn = $("#sfResetBtn");
  const sfSolver = $("#sfSolver");
  const sfSolved = $("#sfSolved");
  const sfDone = $("#sfDone");
  const sfHist = $("#sfHist");
  const sfAttCt = $("#sfAttCt");
  const sfProg = $("#sfProg");
  const sfProgLabel = $("#sfProgLabel");
  const sfVar = $("#sfVar");
  const sfIcon = $("#sfIcon");
  const sfBadge = $("#sfBadge");

  function refresh() {
    const sugg = getNextGuess();
    const pl = getPLen();
    for (let i = 0; i < 4; i++) {
      dVals[i] = sugg[i] || "?";
      $(`#sfD${i}`).textContent = sugg[i] || "?";
    }
    const pct = pl <= 0 ? 100 : Math.max(2, Math.round((1 - Math.log10(Math.max(1, pl)) / 4) * 100));
    sfProg.style.width = pct + "%";
    sfProg.style.background = pl <= 1 ? "#2ecc71" : pl <= 10 ? "#27ae60" : pl <= 100 ? "#f0b429" : "var(--accent)";
    if (pl === 0) {
      sfVar.textContent = "❌ Противоречие — начни заново";
      sfVar.style.color = "var(--bad)"; sfProgLabel.textContent = "";
    } else if (pl === 1) {
      sfVar.innerHTML = `<span style="color:#2ecc71">🎯 Код: <b>${getPoss()[0]}</b></span>`;
      sfProgLabel.textContent = "100% исключено";
    } else {
      sfVar.textContent = `Осталось ${pl.toLocaleString("ru")} вариантов`;
      sfVar.style.color = "";
      sfProgLabel.textContent = pl < 10000 ? `Исключено ${(10000-pl).toLocaleString("ru")} / 10 000` : "";
    }
    sfApply.disabled = !dVals.every(v => v && v !== "?") || solved;
  }

  function setColor(pos, col) {
    dColors[pos] = col;
    $(`#sfT${pos}`).className = `sf-tile ${col}`;
    $(`#sfS${pos}`).textContent = SYM[col];
  }

  $("#sfTiles").addEventListener("click", e => {
    const tile = e.target.closest(".sf-tile[data-pos]");
    if (!tile || solved) return;
    const pos = parseInt(tile.dataset.pos);
    setColor(pos, CYCLE[(CYCLE.indexOf(dColors[pos]) + 1) % 3]);
    sfApply.disabled = !dVals.every(v => v && v !== "?") || solved;
    navigator.vibrate?.(8);
  });

  sfApply.addEventListener("click", () => {
    const guess = dVals.join("");
    if (guess.length !== 4 || guess.includes("?")) return;
    const green = dColors.filter(c => c === "green").length;
    const yellow = dColors.filter(c => c === "yellow").length;
    const sc = green * 5 + yellow;
    const colors = [...dColors];
    attempts.push({ guess, green, yellow, colors });
    possible = filterCodes(getPoss(), guess, sc);
    localStorage.setItem(LS_ATT, JSON.stringify({ date: todayKey(), attempts }));
    if (green === 4) {
      solved = true; sfIcon.textContent = "🔓";
      const n = attempts.length;
      $("#sfSolvedS").textContent = `Код: ${guess} · ${n} ${n===1?"попытка":n<5?"попытки":"попыток"}`;
      sfSolved.style.display = ""; sfSolver.style.display = "none";
    }
    for (let i = 0; i < 4; i++) setColor(i, "gray");
    renderHist(); refresh(); navigator.vibrate?.([10,30,10]);
  });

  function doReset() {
    attempts = []; possible = null; solved = false;
    localStorage.removeItem(LS_ATT);
    for (let i = 0; i < 4; i++) setColor(i, "gray");
    sfIcon.textContent = "🔒"; sfSolved.style.display = "none"; sfSolver.style.display = "";
    renderHist(); refresh();
  }
  sfResetBtn.addEventListener("click", () => {
    if (attempts.length && !confirm("Сбросить попытки?")) return;
    doReset();
  });
  $("#sfResetFromSolved").addEventListener("click", doReset);
  $("#sfMarkOpen").addEventListener("click", () => {
    localStorage.setItem(LS_OPEN, todayKey()); showState(); startDayTimer();
  });
  $("#sfUnmark").addEventListener("click", () => {
    localStorage.removeItem(LS_OPEN); showState();
  });

  function startDayTimer() {
    clearInterval(dayTimer);
    const tick = () => {
      const now = new Date(), next = new Date(now);
      next.setDate(next.getDate() + 1); next.setHours(0, 0, 0, 0);
      const d = next - now, el = $("#sfDoneT");
      if (!el) { clearInterval(dayTimer); return; }
      el.textContent = [String(Math.floor(d/3600000)).padStart(2,"0"), String(Math.floor((d%3600000)/60000)).padStart(2,"0"), String(Math.floor((d%60000)/1000)).padStart(2,"0")].join(":");
    };
    tick(); dayTimer = setInterval(tick, 1000);
  }

  function showState() {
    if (isOpened()) {
      sfDone.style.display = ""; sfSolver.style.display = "none"; sfSolved.style.display = "none";
      sfBadge.innerHTML = `<span class="sf-open-badge">✅ Открыт</span>`;
      sfIcon.textContent = "✅"; startDayTimer();
    } else {
      sfDone.style.display = "none"; sfBadge.innerHTML = "";
      if (solved) { sfSolved.style.display = ""; sfSolver.style.display = "none"; }
      else { sfSolver.style.display = ""; sfSolved.style.display = "none"; }
    }
  }

  function renderHist() {
    sfAttCt.textContent = attempts.length ? `${attempts.length}/10` : "";
    if (!attempts.length) {
      sfHist.innerHTML = `<div class="sf-hist-empty">Ещё нет попыток — введи <b>${G1}</b> в игре ☝️</div>`;
      return;
    }
    sfHist.innerHTML = attempts.map((a, idx) => `
      <div class="sf-att-row">
        <span class="sf-att-n">${idx + 1}</span>
        <div class="sf-att-ds">${a.guess.split("").map((d, i) => `<span class="sf-att-d ${(a.colors || [])[i] || "gray"}">${d}</span>`).join("")}</div>
        <div class="sf-att-r">
          ${a.green ? `<span class="sra-g">✓${a.green}</span>` : ""}
          ${a.yellow ? `<span class="sra-y">◑${a.yellow}</span>` : ""}
          ${!a.green && !a.yellow ? `<span class="sra-n">✕</span>` : ""}
        </div>
      </div>
    `).join("");
  }

  refresh(); renderHist(); showState();
  return root;
}