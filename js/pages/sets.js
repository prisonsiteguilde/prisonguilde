import { esc } from "../utils.js";

const SETS = [
  {
    id: "escape",
    name: "'Побег'",
    size: 4,
    bonus: "Увеличивает уклонение на 15",
    items: [{"code": "escape_hat", "img": "https://media.prison.coffee.agency/test455/items/body/striped/hat-striped.webp"}, {"code": "escape_shirt", "img": "https://media.prison.coffee.agency/test455/items/body/striped/body-striped.webp"}, {"code": "escape_pants", "img": "https://media.prison.coffee.agency/test455/items/body/striped/pants-striped.webp"}, {"code": "escape_boots", "img": "https://media.prison.coffee.agency/test455/items/body/striped/feet-striped.webp"}],
  },
  {
    id: "abibas",
    name: "'Абибас'",
    size: 4,
    bonus: "Увеличивает уважение на 15",
    items: [{"code": "abibas_sharp_cap", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp"}, {"code": "abibas_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp"}, {"code": "abibas_tracksuit", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp"}, {"code": "abibas_stars_sneakers", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp"}],
  },
  {
    id: "base",
    name: "'Бушлат'",
    size: 4,
    bonus: "Увеличивает броню на 10 и сопротивлениен на 5",
    items: [{"code": "prison_hat", "img": "https://media.prison.coffee.agency/test455/items/body/overcoat/hat.png"}, {"code": "prison_body", "img": "https://media.prison.coffee.agency/test455/items/body/overcoat/body.png"}, {"code": "prison_pants", "img": "https://media.prison.coffee.agency/test455/items/body/overcoat/pants.png"}, {"code": "prison_feet", "img": "https://media.prison.coffee.agency/test455/items/body/overcoat/feet.png"}],
  },
  {
    id: "vechorka",
    name: "'Вечерка'",
    size: 4,
    bonus: "Восстанавливает 3 здоровья за ход",
    items: [{"code": "vechorka_cap", "img": "https://media.prison.coffee.agency/test455/items/body/russian/hat-russian.webp"}, {"code": "vechorka_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/russian/body-russian.webp"}, {"code": "vechorka_pants", "img": "https://media.prison.coffee.agency/test455/items/body/russian/pants-russian.webp"}, {"code": "vechorka_flip_flops", "img": "https://media.prison.coffee.agency/test455/items/body/russian/feet-russian.webp"}],
  },
  {
    id: "zenit",
    name: "'Зенит'",
    size: 4,
    bonus: "Увеличивает урон бригады на 20%",
    items: [{"code": "zenit_hat", "img": "https://media.prison.coffee.agency/test455/items/body/zenit/hat.png"}, {"code": "zenit_body", "img": "https://media.prison.coffee.agency/test455/items/body/zenit/body.png"}, {"code": "zenit_pants", "img": "https://media.prison.coffee.agency/test455/items/body/zenit/pants.png"}, {"code": "zenit_feet", "img": "https://media.prison.coffee.agency/test455/items/body/zenit/feet.png"}],
  },
  {
    id: "americano",
    name: "'Американо'",
    size: 3,
    bonus: "Увеличивает точность на 3",
    items: [{"code": "americano_robe", "img": "https://media.prison.coffee.agency/test455/items/body/orange/body-orange.webp"}, {"code": "americano_pants", "img": "https://media.prison.coffee.agency/test455/items/body/orange/pants-orange.webp"}, {"code": "americano_sneakers", "img": "https://media.prison.coffee.agency/test455/items/body/orange/feet-orange.webp"}],
  },
  {
    id: "gambler",
    name: "'Игрок'",
    size: 4,
    bonus: "Увелчивает шанс выпадения предметов из боссов на 30% (От базового)",
    items: [{"code": "gambler_hat", "img": "https://media.prison.coffee.agency/test455/items/body/gambler/hat.png"}, {"code": "gambler_suit", "img": "https://media.prison.coffee.agency/test455/items/body/gambler/suit.png"}, {"code": "gambler_pants", "img": "https://media.prison.coffee.agency/test455/items/body/gambler/pants.png"}, {"code": "gambler_shoes", "img": "https://media.prison.coffee.agency/test455/items/body/gambler/shoes.png"}],
  },
  {
    id: "inkasator",
    name: "'Инкассатор'",
    size: 3,
    bonus: "Увеличивает добычу сигарет с боссов на 15%",
    items: [{"code": "inkasator_hat", "img": "https://media.prison.coffee.agency/test455/items/body/inkasator/hat.png"}, {"code": "inkasator_body", "img": "https://media.prison.coffee.agency/test455/items/body/inkasator/body.png"}, {"code": "inkasator_pants", "img": "https://media.prison.coffee.agency/test455/items/body/inkasator/pants.png"}],
  },
  {
    id: "glukhar",
    name: "'Глухарь'",
    size: 3,
    bonus: "Увеличивает уважение на 100",
    items: [{"code": "glukhar_hat", "img": "https://media.prison.coffee.agency/test455/items/body/glukhar/hat.png"}, {"code": "glukhar_body", "img": "https://media.prison.coffee.agency/test455/items/body/glukhar/body.png"}, {"code": "glukhar_pants", "img": "https://media.prison.coffee.agency/test455/items/body/glukhar/pants.png"}],
  },
  {
    id: "baretsky",
    name: "'Барецкий'",
    size: 3,
    bonus: "Увеличивает уважение и сопротивление на 15",
    items: [{"code": "baretsky_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/baretsky/body-baretsky.png"}, {"code": "baretsky_pants", "img": "https://media.prison.coffee.agency/test455/items/body/baretsky/pants-baretsky.png"}, {"code": "baretsky_shoes", "img": "https://media.prison.coffee.agency/test455/items/body/baretsky/feet-baretsky.png"}],
  },
  {
    id: "laundry",
    name: "'Прачечная'",
    size: 3,
    bonus: "В начале хода имеет шанс 20% развеять негативный эффект",
    items: [{"code": "laundry_hat", "img": "https://media.prison.coffee.agency/test455/items/body/laundry/hat.png"}, {"code": "laundry_body", "img": "https://media.prison.coffee.agency/test455/items/body/laundry/body.png"}, {"code": "laundry_feet", "img": "https://media.prison.coffee.agency/test455/items/body/laundry/feet.png"}],
  },
  {
    id: "gosling",
    name: "'Гослинг'",
    size: 4,
    bonus: "При уклонение от атаки, следующая атака наносит +8% урона",
    items: [{"code": "gosling_patch", "img": "https://media.prison.coffee.agency/test455/items/body/gosling/gosling-head.png"}, {"code": "gosling_coat", "img": "https://media.prison.coffee.agency/test455/items/body/gosling/gosling-body.png"}, {"code": "gosling_pants", "img": "https://media.prison.coffee.agency/test455/items/body/gosling/gosling-pants.png"}, {"code": "gosling_boots", "img": "https://media.prison.coffee.agency/test455/items/body/gosling/gosling-feet.png"}],
  },
  {
    id: "durov",
    name: "'Дуров'",
    size: 3,
    bonus: "Увеличивает точность на 6 и шанс крита на 10%",
    items: [{"code": "durov_cap", "img": "https://media.prison.coffee.agency/test455/items/body/durov/durov-head.png"}, {"code": "durov_longsleeve", "img": "https://media.prison.coffee.agency/test455/items/body/durov/durov-body.png"}, {"code": "durov_pants", "img": "https://media.prison.coffee.agency/test455/items/body/durov/durov-pants.png"}],
  },
  {
    id: "oleg",
    name: "'Олег'",
    size: 2,
    bonus: "Увеличивает уважение на 30",
    items: [{"code": "dejavu_glasses", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/head.png"}, {"code": "fifth_circuit_chain", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/neck.png"}],
  },
  {
    id: "makaron",
    name: "'Макарон'",
    size: 2,
    bonus: "Увеличивает уклонение на 25",
    items: [{"code": "makaron_slippers", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/makaron/slippers.png"}, {"code": "makaron_glasses", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/makaron/glasses.png"}],
  },
  {
    id: "cz",
    name: "'Бывший химик'",
    size: 2,
    bonus: "Увеличивает базовый урон от яда на 10%",
    items: [{"code": "zhan_glasses", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/hat-zhan.webp"}, {"code": "cross_redemption", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-silver.png"}],
  },
  {
    id: "mavrodiy",
    name: "'Мавродий'",
    size: 4,
    bonus: "Увеличивает шанс оглушения на 1%",
    items: [{"code": "mavrodiy_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/body-sergey.png"}, {"code": "mavrodiy_pants", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/pants-sergey.png"}, {"code": "mavrodiy_slippers", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/feet-sergey.png"}, {"code": "mavrodiy_glasses", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/hat-sergey.png"}],
  },
  {
    id: "nurlyz",
    name: "'Миллионер'",
    size: 2,
    bonus: "Увеличивает добычу сигарет с боссов на 25%",
    items: [{"code": "nurlyz_pants", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/pants-nurlyz.png"}, {"code": "nurlyz_slippers", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/feet-nurlyz.png"}],
  },
  {
    id: "zakhar",
    name: "'Захар'",
    size: 3,
    bonus: "Увеличивает шанс критического удара на 12%",
    items: [{"code": "zakhar_glasses", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/glasses-zakhar.png"}, {"code": "pipe_shorts", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/pants-zakhar.png"}, {"code": "pipe_tshirt", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/body-zakhar.png"}],
  },
  {
    id: "dipipi",
    name: "'Дипипи'",
    size: 2,
    bonus: "Увеличивает шанс поджога на 9%",
    items: [{"code": "dipipi_tshirt", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/body-dipipi.png"}, {"code": "dipipi_shorts", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/pants-dipipi.png"}],
  },
  {
    id: "foma",
    name: "'Фома'",
    size: 3,
    bonus: "В начале боя увеличивает сопротивление кровотечению, яду или поджогу на 20, 10%, 20% соответственно. Выбирается случайно",
    items: [{"code": "foma_leather_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/foma/leather-jacket.png"}, {"code": "foma_jeans", "img": "https://media.prison.coffee.agency/test455/items/body/foma/jeans.png"}, {"code": "foma_patent_shoes", "img": "https://media.prison.coffee.agency/test455/items/body/foma/patent-shoes.png"}],
  },
  {
    id: "hockey",
    name: "'Хоккейный'",
    size: 3,
    bonus: "Увеличивает защиту от поджога на 35%",
    items: [{"code": "hockey_helmet", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/helmet.png"}, {"code": "hockey_body_protection", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/body-protection.png"}, {"code": "hockey_gloves", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/gloves.png"}],
  },
  {
    id: "crocodile",
    name: "'Крокодил'",
    size: 3,
    bonus: "Оружие с поджогом всегда поджигает",
    items: [{"code": "crocodile_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-jacket.png"}, {"code": "crocodile_pants", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-pants.png"}, {"code": "crocodile_shoes", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-shoes.png"}],
  },
  {
    id: "vito",
    name: "'Витя'",
    size: 3,
    bonus: "5% шанс получить двойную награду с боссов",
    items: [{"code": "vito_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/suit.png"}, {"code": "vito_pants", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/pants.png"}, {"code": "vito_shoes", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/shoes.png"}],
  },
  {
    id: "thief",
    name: "'Вор в законе'",
    size: 5,
    bonus: "ПОКА НЕ АКТУАЛЕН.",
    items: [{"code": "thief_king_chain", "img": "https://media.prison.coffee.agency/test455/items/body/thief-king/chain.png"}, {"code": "thief_king_ring", "img": "https://media.prison.coffee.agency/test455/items/body/thief-king/ring.png"}, {"code": "thief_king_body", "img": "https://media.prison.coffee.agency/test455/items/body/thief-king/body.png"}, {"code": "thief_king_pants", "img": "https://media.prison.coffee.agency/test455/items/body/thief-king/pants.png"}, {"code": "thief_king_feet", "img": "https://media.prison.coffee.agency/test455/items/body/thief-king/feet.png"}],
  },
  {
    id: "untouchable",
    name: "'Неприкасаемый'",
    size: 3,
    bonus: "Уменьшает входящий урон от атак на 10%",
    items: [{"code": "untouchable_glasses", "img": "https://media.prison.coffee.agency/test455/items/body/untouchable/glasses.png"}, {"code": "untouchable_body", "img": "https://media.prison.coffee.agency/test455/items/body/untouchable/body.png"}, {"code": "untouchable_pants", "img": "https://media.prison.coffee.agency/test455/items/body/untouchable/pants.png"}],
  },
  {
    id: "soul",
    name: "'Освободитель душ'",
    size: 3,
    bonus: "Восстанавливает 1% от максимальноого здоровья за ход и увеличивает эффективность лечения в бою на 10%",
    items: [{"code": "soul_liberator_body", "img": "https://media.prison.coffee.agency/test455/items/body/soul-liberator/body.png"}, {"code": "soul_liberator_cross", "img": "https://media.prison.coffee.agency/test455/items/body/soul-liberator/cross.png"}, {"code": "soul_pants", "img": "https://media.prison.coffee.agency/test455/items/body/soul-liberator/pants.png"}],
  },
  {
    id: "hunter",
    name: "'Охотник'",
    size: 3,
    bonus: "Критические удары по врагам со здоровьем <30% имеют 5% шанс увеличить урон крита до 400%. Не работает на боссов",
    items: [{"code": "hunter_sweater", "img": "https://media.prison.coffee.agency/test455/items/body/hunter/sweater.png"}, {"code": "hunter_pants", "img": "https://media.prison.coffee.agency/test455/items/body/hunter/pants.png"}, {"code": "hunter_boots", "img": "https://media.prison.coffee.agency/test455/items/body/hunter/boots.png"}],
  },
  {
    id: "military",
    name: "'Страйкбольный'",
    size: 4,
    bonus: "За каждую успешную атаку получаешь +1 к точности (до +5). при промахе эффект сбрасывается.",
    items: [{"code": "military_head", "img": "https://media.prison.coffee.agency/test455/items/body/military/head.png"}, {"code": "military_jacket", "img": "https://media.prison.coffee.agency/test455/items/body/military/jacket.png"}, {"code": "military_pants", "img": "https://media.prison.coffee.agency/test455/items/body/military/pants.png"}, {"code": "military_boots", "img": "https://media.prison.coffee.agency/test455/items/body/military/boots.png"}],
  },
  {
    id: "special-forces",
    name: "'Спецназ'",
    size: 4,
    bonus: "За каждую единицу точности +2% к урону.",
    items: [{"code": "special_forces_head", "img": "https://media.prison.coffee.agency/test455/items/body/special-forces/head.png"}, {"code": "special_forces_vest", "img": "https://media.prison.coffee.agency/test455/items/body/special-forces/vest.png"}, {"code": "special_forces_pants", "img": "https://media.prison.coffee.agency/test455/items/body/special-forces/pants.png"}, {"code": "special_forces_boots", "img": "https://media.prison.coffee.agency/test455/items/body/special-forces/boots.png"}],
  },
  {
    id: "ded_moroz",
    name: "'Дед Мороз'",
    size: 4,
    bonus: "Дарует новогоднее настроение.",
    items: [{"code": "ded_moroz_hat", "img": "https://media.prison.coffee.agency/test455/items/body/bp/winter/hat.webp"}, {"code": "ded_moroz_shuba", "img": "https://media.prison.coffee.agency/test455/items/body/bp/winter/shuba.webp"}, {"code": "ded_moroz_valenki", "img": "https://media.prison.coffee.agency/test455/items/body/bp/winter/valenki.webp"}, {"code": "ded_moroz_gloves", "img": "https://media.prison.coffee.agency/test455/items/body/bp/winter/gloves.webp"}],
  },
];

export async function renderSets() {
  const root = document.createElement("div");
  root.className = "sets-page";

  const state = { search: "", selected: null };

  root.innerHTML = `
    <div class="card">
      <div class="row">
        <div>
          <div class="card-title">👕 СЕТЫ</div>
          <div class="card-sub">Состав сетов · Бонусы за комплект</div>
        </div>
        <span class="badge amber">${SETS.length} сетов</span>
      </div>
    </div>
    <div class="card no-accent" style="padding:12px 14px;">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="input" id="setSearch" placeholder="Поиск сета..." style="padding-left:36px;" />
      </div>
    </div>
    <div class="sets-layout">
      <div class="sets-grid" id="setsGrid"></div>
      <div class="sets-detail-panel" id="setsDetail">
        <div class="card" style="text-align:center;padding:40px 16px;color:var(--text-ghost);">
          <div style="font-size:36px;margin-bottom:8px;">👕</div>
          <div>Выбери сет для просмотра деталей</div>
        </div>
      </div>
    </div>
  `;

  root.querySelector("#setSearch").addEventListener("input", e => {
    clearTimeout(e.target._t);
    e.target._t = setTimeout(() => {
      state.search = e.target.value.toLowerCase().trim();
      renderGrid();
    }, 150);
  });

  function renderGrid() {
    const list = SETS.filter(s => !state.search || s.name.toLowerCase().includes(state.search));
    const el = root.querySelector("#setsGrid");

    if (!list.length) {
      el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🔍</div><div class="empty-text">Не найдено</div></div>`;
      return;
    }

    el.innerHTML = list.map(s => {
      const isActive = state.selected === s.id;
      const previewImg = s.items[0]?.img || "";
      return `
        <div class="set-card ${isActive ? "active" : ""}" data-set="${esc(s.id)}">
          <div class="set-card-imgs">
            ${s.items.slice(0, 4).map(it =>
              `<img src="${esc(it.img)}" class="set-card-img" loading="lazy" onerror="this.style.opacity='.2'" />`
            ).join("")}
          </div>
          <div class="set-card-name">${esc(s.name)}</div>
          <div class="set-card-meta">
            <span class="badge" style="background:var(--card2);font-size:10px;">${s.size} предм.</span>
            ${s.bonus ? `<span class="set-has-bonus">⚡ Бонус</span>` : ""}
          </div>
        </div>`;
    }).join("");

    el.querySelectorAll("[data-set]").forEach(card => {
      card.addEventListener("click", () => {
        state.selected = card.dataset.set;
        renderGrid();
        renderDetail(SETS.find(s => s.id === state.selected));
      });
    });
  }

  function renderDetail(s) {
    const el = root.querySelector("#setsDetail");
    if (!s) return;

    el.innerHTML = `
      <div class="card">
        <div class="card-title" style="font-size:18px;margin-bottom:4px;">${esc(s.name)}</div>
        <div class="muted" style="font-size:11px;margin-bottom:14px;">Размер сета: ${s.size} предмета</div>

        <div class="set-detail-items">
          ${s.items.map((it, i) => `
            <div class="set-detail-item">
              <div class="set-detail-img-wrap">
                <img src="${esc(it.img)}" class="set-detail-img" loading="lazy" onerror="this.style.opacity='.2'" />
                <span class="set-detail-num">${i + 1}</span>
              </div>
              <div class="set-detail-code muted">${esc(it.code.replace(/_/g, " "))}</div>
            </div>
          `).join("")}
        </div>

        ${s.bonus ? `
          <div class="hr" style="margin:14px 0;"></div>
          <div class="card-title" style="font-size:13px;margin-bottom:8px;">⚡ Бонус сета</div>
          <div class="set-bonus-text">${esc(s.bonus)}</div>
        ` : `
          <div class="hr" style="margin:14px 0;"></div>
          <div class="muted" style="font-size:12px;text-align:center;padding:8px 0;">
            Бонус сета не задан
          </div>
        `}
      </div>
    `;
  }

  renderGrid();
  return root;
}
