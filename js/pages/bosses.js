import { esc } from '../utils.js';

const BOSSES = [
{
  id: "homa",
  name: "Кучерявый",
  img: "https://media.prison.coffee.agency/bosses/homa/preview.png",
  imgFull: "https://media.prison.coffee.agency/bosses/homa/image.webp",
  desc: "Кучерявый здесь новенький, но уже успел обзавестись авторитетом среди местного ворья",
  requiredLvl: 1,
  cooldown: 6,
  maxPhase: 1,
  imm: [],
  difficulties: {
    easy: {
      hp: 1500, dmgMin: 3, dmgMax: 5,
      armor: 3, evasion: 10, accuracy: 10,
      critChance: 0, critDmg: 0,
      cost: 40,
      statusResists: {"1": 0, "2": 0, "3": 50, "4": 15},
      damageResists: {"1": 0, "2": 0, "3": 0},
      awards: [
        { sigs: "200" },
        { name: "Застывшая кровь", img: "https://media.prison.coffee.agency/test455/items/weapons/blood_shank.png", rarity: "Uncommon", qty: "1" },
        { name: "Шапка 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/hat-striped.webp", rarity: "Common", qty: "1" },
        { name: "Рубашка 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/body-striped.webp", rarity: "Common", qty: "1" },
        { name: "Штаны 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/pants-striped.webp", rarity: "Common", qty: "1" },
        { name: "Ботинки 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/feet-striped.webp", rarity: "Common", qty: "1" },
      ],
    },
    normal: {
      hp: 2500, dmgMin: 5, dmgMax: 8,
      armor: 5, evasion: 15, accuracy: 15,
      critChance: 5, critDmg: 0,
      cost: 80,
      statusResists: {"1": 10, "2": 10, "3": 100, "4": 15},
      damageResists: {"1": 5, "2": 5, "3": 0},
      awards: [
        { sigs: "400" },
        { name: "Застывшая кровь", img: "https://media.prison.coffee.agency/test455/items/weapons/blood_shank.png", rarity: "Uncommon", qty: "1" },
        { name: "Шапка 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/hat-striped.webp", rarity: "Common", qty: "1" },
        { name: "Рубашка 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/body-striped.webp", rarity: "Common", qty: "1" },
        { name: "Штаны 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/pants-striped.webp", rarity: "Common", qty: "1" },
        { name: "Ботинки 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/feet-striped.webp", rarity: "Common", qty: "1" },
      ],
    },
    hard: {
      hp: 10000, dmgMin: 8, dmgMax: 12,
      armor: 8, evasion: 20, accuracy: 20,
      critChance: 10, critDmg: 20,
      cost: 120,
      statusResists: {"1": 20, "2": 20, "3": 150, "4": 20},
      damageResists: {"1": 20, "2": 20, "3": 20},
      awards: [
        { sigs: "800" },
        { name: "Застывшая кровь", img: "https://media.prison.coffee.agency/test455/items/weapons/blood_shank.png", rarity: "Uncommon", qty: "1" },
        { name: "Шапка 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/hat-striped.webp", rarity: "Uncommon", qty: "1" },
        { name: "Рубашка 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/body-striped.webp", rarity: "Uncommon", qty: "1" },
        { name: "Штаны 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/pants-striped.webp", rarity: "Uncommon", qty: "1" },
        { name: "Ботинки 'Побег'", img: "https://media.prison.coffee.agency/test455/items/body/striped/feet-striped.webp", rarity: "Uncommon", qty: "1" },
      ],
    },
    blat: {
      hp: 12000, dmgMin: 14, dmgMax: 20,
      armor: 12, evasion: 20, accuracy: 30,
      critChance: 10, critDmg: 40,
      cost: 200,
      statusResists: {"1": 20, "2": 20, "3": 150, "4": 20},
      damageResists: {"1": 30, "2": 30, "3": 30},
      awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
      { name: "Медаль Кучерявого.", img: "https://media.prison.coffee.agency/items/other/medal_boss_homa.png", rarity: "Legendary", qty: "1" },],
    },
  },
},
  {
    id: "banker",
    name: "Банкир",
    img: "https://media.prison.coffee.agency/bosses/banker/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/banker/image.webp",
    desc: "Когда-то Банкир был владельцем крупного банка. Он привык к тому, что мир лежит у его ног. Однажды он решил рискнуть и провернуть аферу на 8 миллиардов долларов. В его мире, где деньги решали всё, это казалось лишь очередной игрой. Все перевернулось в считанные минуты. Теперь его новая жизнь — клетка с грязными стенами, лишенная роскоши и власти",
    requiredLvl: 6,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 6000, dmgMin: 7, dmgMax: 8,
        armor: 1, evasion: 0, accuracy: 2,
        critChance: 0, critDmg: 0,
        cost: 80,
        statusResists: {"1": 0, "2": 0, "3": 250, "4": 20},
        damageResists: {"1": 0, "2": 0, "3": 0},
        awards: [{"sigs": "500"}, 
              {"name": "Козырек 'Abibas Sharp'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp", "rarity": "Rare"}, 
              {"name": "Куртка 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp", "rarity": "Rare"}, 
              {"name": "Спортивки 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp", "rarity": "Rare"}, 
              {"name": "Кроссовки 'Abibas Stars'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp", "rarity": "Rare"}, 
              {"name": "Розочка", "img": "https://media.prison.coffee.agency/items/weapons/rosa.webp", "rarity": "Uncommon"}, 
              {"name": "Пиджак Банкира", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/body-banker.webp", "rarity": "Epic", "qty": "1"}, 
              {"name": "Нож-кредитка", "img": "https://media.prison.coffee.agency/items/weapons/knife_credit.webp", "rarity": "Rare"}],
      },
      normal: {
        hp: 12000, dmgMin: 16, dmgMax: 20,
        armor: 5, evasion: 30, accuracy: 15,
        critChance: 5, critDmg: 15,
        cost: 150,
        statusResists: {"1": 10, "2": 20, "3": 300, "4": 20},
        damageResists: {"1": 18, "2": 10, "3": 5},
        awards: [{"sigs": "800"}, 
              {"name": "Козырек 'Abibas Sharp'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp", "rarity": "Rare"}, 
              {"name": "Куртка 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp", "rarity": "Rare"}, 
              {"name": "Спортивки 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp", "rarity": "Rare"}, 
              {"name": "Кроссовки 'Abibas Stars'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp", "rarity": "Rare"}, 
              {"name": "Розочка", "img": "https://media.prison.coffee.agency/items/weapons/rosa.webp", "rarity": "Uncommon"}, 
              {"name": "Пиджак Банкира", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/body-banker.webp", "rarity": "Epic", "qty": "1"}, 
              {"name": "Нож-кредитка", "img": "https://media.prison.coffee.agency/items/weapons/knife_credit.webp", "rarity": "Epic"}],
      },
      hard: {
        hp: 20000, dmgMin: 25, dmgMax: 35,
        armor: 12, evasion: 40, accuracy: 20,
        critChance: 10, critDmg: 25,
        cost: 250,
        statusResists: {"1": 100, "2": 40, "3": 400, "4": 20},
        damageResists: {"1": 25, "2": 15, "3": 10},
        awards: [{"sigs": "500"}, 
              {"name": "Зажигалка Zippo'", "img": "https://media.prison.coffee.agency/test455/items/body/accessories/zippo.png", "rarity": "Common"}, 
              {"name": "Козырек 'Abibas Sharp'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp", "rarity": "Rare"}, 
              {"name": "Куртка 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp", "rarity": "Rare"}, 
              {"name": "Спортивки 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp", "rarity": "Rare"}, 
              {"name": "Кроссовки 'Abibas Stars'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp", "rarity": "Rare"}, 
              {"name": "Розочка", "img": "https://media.prison.coffee.agency/items/weapons/rosa.webp", "rarity": "Uncommon"}, 
              {"name": "Пиджак Банкира", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/body-banker.webp", "rarity": "Epic", "qty": "1"}, 
              {"name": "Нож-кредитка", "img": "https://media.prison.coffee.agency/items/weapons/knife_credit.webp", "rarity": "Epic"}],
      },
      blat: {
        hp: 26000, dmgMin: 35, dmgMax: 45,
        armor: 15, evasion: 45, accuracy: 45,
        critChance: 10, critDmg: 35,
        cost: 300,
        statusResists: {"1": 100, "2": 40, "3": 400, "4": 20},
        damageResists: {"1": 25, "2": 15, "3": 10},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Банкира.", img: "https://media.prison.coffee.agency/items/other/medal_boss_banker.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "ashab",
    name: "Ашаб",
    img: "https://media.prison.coffee.agency/bosses/ashab/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/ashab/image.png",
    desc: "Нурлыз был королём мотивации и сетевого мастерства. Его курсы расходились, как горячие чебуреки, а армия последователей называла его просто — Учитель.",
    requiredLvl: 9,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 4000, dmgMin: 14, dmgMax: 20,
        armor: 15, evasion: 7, accuracy: 15,
        critChance: 10, critDmg: 60,
        cost: 150,
        statusResists: {"1": 0, "2": 0, "3": 300, "4": 0},
        damageResists: {"1": 25, "2": 0, "3": 15},
        awards: [{"sigs": "400–600"}, 
          {"name": "Шорты Ашаба", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/pants-ashab.webp", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Перчатки Ашаба", "img": "https://media.prison.coffee.agency/test455/items/weapons/ashab-gloves.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Пиджак советский", "img": "https://media.prison.coffee.agency/test455/items/body/gambler/suit.png", "rarity": "Common"}, 
          {"name": "Кепочка водилы", "img": "https://media.prison.coffee.agency/test455/items/head/gambler/hat.png", "rarity": "Common"}, 
          {"name": "Брюки от костюма", "img": "https://media.prison.coffee.agency/test455/items/gambler/pants.png", "rarity": "Common"}, 
          {"name": "Туфли батька", "img": "https://media.prison.coffee.agency/test455/items/feet/gambler/shoes.png", "rarity": "Common"}],
      },
      normal: {
        hp: 12000, dmgMin: 20, dmgMax: 28,
        armor: 22, evasion: 30, accuracy: 20,
        critChance: 12, critDmg: 75,
        cost: 250,
        statusResists: {"1": 10, "2": 60, "3": 400, "4": 0},
        damageResists: {"1": 35, "2": 15, "3": 25},
        awards: [{"sigs": "500–700"}, 
          {"name": "Шорты Ашаба", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/pants-ashab.webp", "rarity": "Rare", "qty": "1"}, 
          {"name": "Перчатки Ашаба", "img": "https://media.prison.coffee.agency/test455/items/weapons/ashab-gloves.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Пиджак советский", "img": "https://media.prison.coffee.agency/test455/items/gambler/suit.png", "rarity": "Uncommon"}, 
          {"name": "Кепочка водилы", "img": "https://media.prison.coffee.agency/test455/items/gambler/hat.png", "rarity": "Uncommon"}, 
          {"name": "Брюки от костюма", "img": "https://media.prison.coffee.agency/test455/items/gambler/pants.png", "rarity": "Uncommon"}, 
          {"name": "Туфли батька", "img": "https://media.prison.coffee.agency/test455/items/gambler/shoes.png", "rarity": "Uncommon"}],
      },
      hard: {
        hp: 20000, dmgMin: 28, dmgMax: 40,
        armor: 30, evasion: 40, accuracy: 25,
        critChance: 15, critDmg: 90,
        cost: 400,
        statusResists: {"1": 45, "2": 80, "3": 500, "4": 0},
        damageResists: {"1": 45, "2": 25, "3": 35},
        awards: [{"sigs": "700–1000"}, 
            {"name": "Шорты Ашаба", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/pants-ashab.webp", "rarity": "Epic", "qty": "1"}, 
            {"name": "Перчатки Ашаба", "img": "https://media.prison.coffee.agency/test455/items/weapons/ashab-gloves.png", "rarity": "Epic", "qty": "1"}, 
            {"name": "Пиджак советский", "img": "https://media.prison.coffee.agency/test455/items/gambler/suit.png", "rarity": "Rare"}, 
            {"name": "Кепочка водилы", "img": "https://media.prison.coffee.agency/test455/items/gambler/hat.png", "rarity": "Rare"}, 
            {"name": "Брюки от костюма", "img": "https://media.prison.coffee.agency/test455/items/gambler/pants.png", "rarity": "Rare"}, 
            {"name": "Туфли батька", "img": "https://media.prison.coffee.agency/test455/items/gambler/shoes.png", "rarity": "Rare"}],
      },
      blat: {
        hp: 26000, dmgMin: 36, dmgMax: 52,
        armor: 35, evasion: 44, accuracy: 40,
        critChance: 15, critDmg: 117,
        cost: 500,
        statusResists: {"1": 45, "2": 80, "3": 500, "4": 0},
        damageResists: {"1": 45, "2": 25, "3": 35},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Ашаба.", img: "https://media.prison.coffee.agency/items/other/medal_boss_ashab.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "oleg",
    name: "Олег Дежавю",
    img: "https://media.prison.coffee.agency/bosses/oleg/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/oleg/image.png",
    desc: "Олег был не просто рэпером — он был брендом, угрозой и кумиром в одном лице. Его треки взрывали чарты, а связи уходили глубже, чем биты в его куплетах. За кулисами гремели сделки, за сценой — выстрелы. Всё закончилось на границе, когда вместо фанатов его встретили с наручниками. Теперь он читает куплеты в хриплом шёпоте, чтобы не слышали охранники.",
    requiredLvl: 10,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Кровотечение"],
    difficulties: {
      easy: {
        hp: 9000, dmgMin: 14, dmgMax: 16,
        armor: 20, evasion: 10, accuracy: 10,
        critChance: 0, critDmg: 0,
        cost: 200,
        statusResists: {"1": 1, "2": 50, "3": 400, "4": 10},
        damageResists: {"1": 24, "2": 24, "3": 0},
        awards: [{"sigs": "400–600"}, 
          {"name": "Очки дежавю", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/head.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Пятая цепь", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/neck.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "99я проблема", "img": "https://media.prison.coffee.agency/items/weapons/knuckle-knife.png", "rarity": "Uncommon"}],
      },
      normal: {
        hp: 16000, dmgMin: 20, dmgMax: 28,
        armor: 30, evasion: 30, accuracy: 30,
        critChance: 10, critDmg: 30,
        cost: 1500,
        statusResists: {"1": 1, "2": 70, "3": 500, "4": 10},
        damageResists: {"1": 50, "2": 50, "3": 10},
        awards: [ 
          {"name": "Очки дежавю", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/head.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Пятая цепь", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/neck.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "99я проблема", "img": "https://media.prison.coffee.agency/items/weapons/knuckle-knife.png", "rarity": "Rare"}],
      },
      hard: {
        hp: 28000, dmgMin: 30, dmgMax: 42,
        armor: 40, evasion: 40, accuracy: 40,
        critChance: 20, critDmg: 50,
        cost: 2200,
        statusResists: {"1": 1, "2": 90, "3": 600, "4": 10},
        damageResists: {"1": 60, "2": 60, "3": 20},
        awards: [ 
          {"name": "Очки дежавю", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/head.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Пятая цепь", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/oleg/neck.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "99я проблема", "img": "https://media.prison.coffee.agency/items/weapons/knuckle-knife.png", "rarity": "Rare"}],
      },
      blat: {
        hp: 32000, dmgMin: 40, dmgMax: 55,
        armor: 45, evasion: 45, accuracy: 60,
        critChance: 20, critDmg: 60,
        cost: 3000,
        statusResists: {"1": 1, "2": 90, "3": 600, "4": 10},
        damageResists: {"1": 60, "2": 60, "3": 20},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Олега.", img: "https://media.prison.coffee.agency/items/other/medal_boss_oleg.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "makaron",
    name: "Арсений Макарон",
    img: "https://media.prison.coffee.agency/bosses/makaron/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/makaron/image.png",
    desc: "Арсений Макарон — это босс, который может быть очень опасным. Он может быть очень опасным.",
    requiredLvl: 11,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 12000, dmgMin: 16, dmgMax: 20,
        armor: 20, evasion: 22, accuracy: 18,
        critChance: 0, critDmg: 0,
        cost: 300,
        statusResists: {"1": 10, "2": 50, "3": 500, "4": 12},
        damageResists: {"1": 22, "2": 22, "3": 15},
        awards: [{"sigs": "400–600"}, 
          {"name": "Очки Макарона", "img": "https://media.prison.coffee.agency/items/body/bosses/makaron/glasses.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Крокодиловые тапочки", "img": "https://media.prison.coffee.agency/items/body/bosses/makaron/slippers.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Топорик Макарона", "img": "https://media.prison.coffee.agency/items/weapons/hatchet_base.png", "rarity": "Uncommon", "qty": "1"}],
      },
      normal: {
        hp: 24000, dmgMin: 25, dmgMax: 32,
        armor: 35, evasion: 35, accuracy: 35,
        critChance: 12, critDmg: 35,
        cost: 1500,
        statusResists: {"1": 20, "2": 65, "3": 600, "4": 12},
        damageResists: {"1": 45, "2": 45, "3": 30},
        awards: [
          {"name": "Очки Макарона", "img": "https://media.prison.coffee.agency/items/body/bosses/makaron/glasses.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Крокодиловые тапочки", "img": "https://media.prison.coffee.agency/items/body/bosses/makaron/slippers.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Топорик Макарона", "img": "https://media.prison.coffee.agency/items/weapons/hatchet_base.png", "rarity": "Uncommon", "qty": "1"}],
      },
      hard: {
        hp: 40000, dmgMin: 35, dmgMax: 45,
        armor: 45, evasion: 45, accuracy: 45,
        critChance: 20, critDmg: 55,
        cost: 2500,
        statusResists: {"1": 30, "2": 80, "3": 700, "4": 12},
        damageResists: {"1": 55, "2": 55, "3": 35},
        awards: [
          {"name": "Очки Макарона", "img": "https://media.prison.coffee.agency/items/body/bosses/makaron/glasses.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Крокодиловые тапочки", "img": "https://media.prison.coffee.agency/items/body/bosses/makaron/slippers.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Топорик Макарона", "img": "https://media.prison.coffee.agency/items/weapons/hatchet_base.png", "rarity": "Rare", "qty": "1"}],
      },
      blat: {
        hp: 46000, dmgMin: 45, dmgMax: 55,
        armor: 50, evasion: 50, accuracy: 60,
        critChance: 20, critDmg: 70,
        cost: 3000,
        statusResists: {"1": 30, "2": 80, "3": 700, "4": 12},
        damageResists: {"1": 55, "2": 55, "3": 35},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Макарона.", img: "https://media.prison.coffee.agency/items/other/medal_boss_arsen.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "mrbusiness",
    name: "Бизнесмен",
    img: "https://media.prison.coffee.agency/bosses/mrbusiness/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/mrbusiness/image.webp",
    desc: "Для большинства он - глава крупнейшего колхоза, выращивающего картошку. Но для остальных открывается его темная сторона - безжалостный бандит, который жестоко разбирается со своими врагами с помощью своей лопаты. По крайней мере так было, пока он не оказался здесь...",
    requiredLvl: 12,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Оглушение"],
    difficulties: {
      easy: {
        hp: 17000, dmgMin: 15, dmgMax: 18,
        armor: 6, evasion: 0, accuracy: 40,
        critChance: 0, critDmg: 0,
        cost: 400,
        statusResists: {"1": 0, "2": 0, "3": 700, "4": 20},
        damageResists: {"1": 15, "2": 25, "3": 0},
        awards: [{"sigs": "1200–1500"}, 
          {"name": "Четки Костяной Шёпот", "img": "https://media.prison.coffee.agency/test455/items/body/beads/bone.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Обвес Золотой Змей", "img": "https://media.prison.coffee.agency/test455/items/body/neck/chain-gold.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Крест Смирения", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-wooden.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Кепарик 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/hat-russian.webp", "rarity": "Rare"}, 
          {"name": "Куртка 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/body-russian.webp", "rarity": "Rare"}, 
          {"name": "Штаны 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/pants-russian.webp", "rarity": "Rare"}, 
          {"name": "Сланцы 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/feet-russian.webp", "rarity": "Rare"}, 
          {"name": "Стальная бульба", "img": "https://media.prison.coffee.agency/items/weapons/steel_shovel.webp", "rarity": "Rare"}, 
          {"name": "Трусы бизнесмена", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/pants-mrbusiness.webp", "rarity": "Epic"}], 
      },
      normal: {
        hp: 28000, dmgMin: 22, dmgMax: 28,
        armor: 10, evasion: 10, accuracy: 50,
        critChance: 5, critDmg: 20,
        cost: 450,
        statusResists: {"1": 15, "2": 15, "3": 800, "4": 20},
        damageResists: {"1": 25, "2": 35, "3": 10},
        awards: [ 
          {"name": "Четки Костяной Шёпот", "img": "https://media.prison.coffee.agency/test455/items/body/beads/bone.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Обвес Золотой Змей", "img": "https://media.prison.coffee.agency/test455/items/body/neck/chain-gold.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Крест Смирения", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-wooden.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Кепарик 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/hat-russian.webp", "rarity": "Rare"}, 
          {"name": "Куртка 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/body-russian.webp", "rarity": "Rare"}, 
          {"name": "Штаны 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/pants-russian.webp", "rarity": "Rare"}, 
          {"name": "Сланцы 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/feet-russian.webp", "rarity": "Rare"}, 
          {"name": "Стальная бульба", "img": "https://media.prison.coffee.agency/items/weapons/steel_shovel.webp", "rarity": "Epic"}, 
          {"name": "Трусы бизнесмена", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/pants-mrbusiness.webp", "rarity": "Epic"}], 
      },
      hard: {
        hp: 45000, dmgMin: 30, dmgMax: 40,
        armor: 15, evasion: 15, accuracy: 60,
        critChance: 10, critDmg: 30,
        cost: 700,
        statusResists: {"1": 30, "2": 30, "3": 1000, "4": 20},
        damageResists: {"1": 35, "2": 45, "3": 20},
        awards: [
          {"name": "Четки Костяной Шёпот", "img": "https://media.prison.coffee.agency/test455/items/body/beads/bone.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Обвес Золотой Змей", "img": "https://media.prison.coffee.agency/test455/items/body/neck/chain-gold.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Крест Смирения", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-wooden.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Кепарик 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/hat-russian.webp", "rarity": "Rare"}, 
          {"name": "Куртка 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/body-russian.webp", "rarity": "Rare"}, 
          {"name": "Штаны 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/pants-russian.webp", "rarity": "Rare"}, 
          {"name": "Сланцы 'Вечерка'", "img": "https://media.prison.coffee.agency/test455/items/body/russian/feet-russian.webp", "rarity": "Rare"}, 
          {"name": "Стальная бульба", "img": "https://media.prison.coffee.agency/items/weapons/steel_shovel.webp", "rarity": "Epic"}, 
          {"name": "Трусы бизнесмена", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/pants-mrbusiness.webp", "rarity": "Epic"}], 
      },
      blat: {
        hp: 52000, dmgMin: 40, dmgMax: 50,
        armor: 15, evasion: 15, accuracy: 100,
        critChance: 10, critDmg: 35,
        cost: 1000,
        statusResists: {"1": 30, "2": 30, "3": 1000, "4": 20},
        damageResists: {"1": 35, "2": 45, "3": 20},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Бизнесамена.", img: "https://media.prison.coffee.agency/items/other/medal_boss_business.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "cz",
    name: "Жан Четырехпалый",
    img: "https://media.prison.coffee.agency/bosses/cz/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/cz/image.webp",
    desc: "Великий химик из поднебесной. Начинал с производства простейших витаминок, но вскоре создал крупнейшую в мире сеть подпольных лабораторий. В погоне за идеальной формулой потерял палец, но это лишь раззадорило его научный интерес. Говорят, что его формула может превратить воду в золото, но сейчас его больше интересует, как превратить тюремную баланду во что-то съедобное...",
    requiredLvl: 16,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Яд"],
    difficulties: {
      easy: {
        hp: 35000, dmgMin: 22, dmgMax: 28,
        armor: 7, evasion: 15, accuracy: 15,
        critChance: 0, critDmg: 0,
        cost: 888,
        statusResists: {"1": 0, "2": 50, "3": 800, "4": 25},
        damageResists: {"1": 20, "2": 0, "3": 15},
        awards: [{"sigs": "1200–2000"}, 
          {"name": "Крест Искупления", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-silver.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Козырек 'Abibas Sharp'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp", "rarity": "Rare"}, 
          {"name": "Куртка 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp", "rarity": "Rare"}, 
          {"name": "Спортивки 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp", "rarity": "Rare"}, 
          {"name": "Кроссовки 'Abibas Stars'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp", "rarity": "Rare"}, 
          {"name": "Очки Жана Четырехпалого", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/hat-zhan.webp", "rarity": "Epic", "qty": "1"},  
          {"name": "Перчатка с гвоздями", "img": "https://media.prison.coffee.agency/items/weapons/glove_nails.webp", "rarity": "Rare"}],
      },
      normal: {
        hp: 60000, dmgMin: 35, dmgMax: 45,
        armor: 12, evasion: 25, accuracy: 20,
        critChance: 8, critDmg: 25,
        cost: 1200,
        statusResists: {"1": 20, "2": 75, "3": 900, "4": 25},
        damageResists: {"1": 30, "2": 10, "3": 25},
        awards: [
          {"name": "Крест Искупления", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-silver.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Козырек 'Abibas Sharp'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp", "rarity": "Rare"}, 
          {"name": "Куртка 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp", "rarity": "Rare"}, 
          {"name": "Спортивки 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp", "rarity": "Rare"}, 
          {"name": "Кроссовки 'Abibas Stars'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp", "rarity": "Rare"}, 
          {"name": "Очки Жана Четырехпалого", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/hat-zhan.webp", "rarity": "Epic", "qty": "1"},  
          {"name": "Перчатка с гвоздями", "img": "https://media.prison.coffee.agency/items/weapons/glove_nails.webp", "rarity": "Epic"}],
      },
      hard: {
        hp: 95000, dmgMin: 50, dmgMax: 65,
        armor: 18, evasion: 35, accuracy: 30,
        critChance: 15, critDmg: 40,
        cost: 1800,
        statusResists: {"1": 40, "2": 100, "3": 1000, "4": 25},
        damageResists: {"1": 40, "2": 20, "3": 35},
        awards: [
          {"name": "Крест Искупления", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-silver.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Козырек 'Abibas Sharp'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/hat-sport.webp", "rarity": "Rare"}, 
          {"name": "Куртка 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/body-sport.webp", "rarity": "Rare"}, 
          {"name": "Спортивки 'Abibas'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/pants-sport.webp", "rarity": "Rare"}, 
          {"name": "Кроссовки 'Abibas Stars'", "img": "https://media.prison.coffee.agency/test455/items/body/sport/feet-sport.webp", "rarity": "Rare"}, 
          {"name": "Очки Жана Четырехпалого", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/hat-zhan.webp", "rarity": "Epic", "qty": "1"},  
          {"name": "Перчатка с гвоздями", "img": "https://media.prison.coffee.agency/items/weapons/glove_nails.webp", "rarity": "Epic"}],
      },
      blat: {
        hp: 110000, dmgMin: 65, dmgMax: 85,
        armor: 20, evasion: 40, accuracy: 80,
        critChance: 15, critDmg: 50,
        cost: 2500,
        statusResists: {"1": 40, "2": 100, "3": 1000, "4": 25},
        damageResists: {"1": 40, "2": 20, "3": 35},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Жана.", img: "https://media.prison.coffee.agency/items/other/medal_boss_zhan.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "sergey",
    name: "Сергей Пирамидович",
    img: "https://media.prison.coffee.agency/bosses/sergey/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/sergey/image.webp",
    desc: "Легендарный математик, построивший больше пирамид, чем египтяне. Даже здесь половина охраны вложилась в его бизнес по перепродаже окурков",
    requiredLvl: 20,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Оглушение"],
    difficulties: {
      easy: {
        hp: 50000, dmgMin: 46, dmgMax: 56,
        armor: 5, evasion: 35, accuracy: 20,
        critChance: 0, critDmg: 0,
        cost: 2500,
        statusResists: {"1": 4, "2": 10, "3": 1000, "4": 15},
        damageResists: {"1": 0, "2": 0, "3": 30},
        awards: [{"sigs": "3200–4000"}, 
          {"name": "Крест Святыня Братвы", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-gold.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Кольцо бриллиантовая рука", "img": "https://media.prison.coffee.agency/test455/items/body/rings/diamond.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Очки 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/hat-sergey.png", "rarity": "Epic"}, 
          {"name": "Куртка 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/body-sergey.png", "rarity": "Epic"}, 
          {"name": "Штаны 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/pants-sergey.png", "rarity": "Epic"}, 
          {"name": "Тапки 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/feet-sergey.png", "rarity": "Epic"}, 
          {"name": "Носок с гвоздями", "img": "https://media.prison.coffee.agency/items/weapons/sock_nails.png", "rarity": "Rare"}],
      },
      normal: {
        hp: 100000, dmgMin: 65, dmgMax: 80,
        armor: 10, evasion: 50, accuracy: 30,
        critChance: 12, critDmg: 35,
        cost: 4000,
        statusResists: {"1": 10, "2": 25, "3": 1300, "4": 15},
        damageResists: {"1": 15, "2": 15, "3": 45},
        awards: [
          {"name": "Крест Святыня Братвы", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-gold.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Кольцо бриллиантовая рука", "img": "https://media.prison.coffee.agency/test455/items/body/rings/diamond.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Очки 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/hat-sergey.png", "rarity": "Epic"}, 
          {"name": "Куртка 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/body-sergey.png", "rarity": "Epic"}, 
          {"name": "Штаны 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/pants-sergey.png", "rarity": "Epic"}, 
          {"name": "Тапки 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/feet-sergey.png", "rarity": "Epic"}, 
          {"name": "Носок с гвоздями", "img": "https://media.prison.coffee.agency/items/weapons/sock_nails.png", "rarity": "Epic"}],
      },
      hard: {
        hp: 160000, dmgMin: 90, dmgMax: 115,
        armor: 18, evasion: 65, accuracy: 40,
        critChance: 25, critDmg: 60,
        cost: 6000,
        statusResists: {"1": 20, "2": 40, "3": 1600, "4": 15},
        damageResists: {"1": 25, "2": 25, "3": 60},
        awards: [
          {"name": "Крест Святыня Братвы", "img": "https://media.prison.coffee.agency/test455/items/body/neck/cross-gold.png", "rarity": "Unique", "qty": "1"}, 
          {"name": "Кольцо бриллиантовая рука", "img": "https://media.prison.coffee.agency/test455/items/body/rings/diamond.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Очки 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/hat-sergey.png", "rarity": "Epic"}, 
          {"name": "Куртка 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/body-sergey.png", "rarity": "Epic"}, 
          {"name": "Штаны 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/pants-sergey.png", "rarity": "Epic"}, 
          {"name": "Тапки 'Мавродий'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/sergey/feet-sergey.png", "rarity": "Epic"}, 
          {"name": "Носок с гвоздями", "img": "https://media.prison.coffee.agency/items/weapons/sock_nails.png", "rarity": "Epic"}],
      },
      blat: {
        hp: 185000, dmgMin: 110, dmgMax: 140,
        armor: 20, evasion: 70, accuracy: 90,
        critChance: 25, critDmg: 70,
        cost: 7500,
        statusResists: {"1": 20, "2": 40, "3": 1600, "4": 15},
        damageResists: {"1": 25, "2": 25, "3": 60},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Сергея.", img: "https://media.prison.coffee.agency/items/other/medal_boss_sergey.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "nurlyz",
    name: "Нурлыз Суетанов",
    img: "https://media.prison.coffee.agency/bosses/nurlyz/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/nurlyz/image.png",
    desc: "Нурлыз был королём мотивации и сетевого мастерства. Его курсы расходились, как горячие чебуреки, а армия последователей называла его просто — Учитель.",
    requiredLvl: 22,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 150000, dmgMin: 75, dmgMax: 90,
        armor: 25, evasion: 80, accuracy: 30,
        critChance: 15, critDmg: 80,
        cost: 5000,
        statusResists: {"1": 70, "2": 60, "3": 2000, "4": 0},
        damageResists: {"1": 35, "2": 35, "3": 75},
        awards: [{"sigs": "3500–4500"}, 
          {"name": "Половина воровского медальона №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-3-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Кусок карты №1", "img": "https://media.prison.coffee.agency/test455/items/smuggler/map-piece-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Мокасины 'Шаги к успеху'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/feet-nurlyz.png", "rarity": "Rare"}, 
          {"name": "Штаны 'Миллионер'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/pants-nurlyz.png", "rarity": "Rare"}, 
          {"name": "Чернильный клинок", "img": "https://media.prison.coffee.agency/test455/items/weapons/ink-blade.png", "rarity": "Rare"}],
      },
      normal: {
        hp: 300000, dmgMin: 100, dmgMax: 130,
        armor: 40, evasion: 95, accuracy: 35,
        critChance: 15, critDmg: 110,
        cost: 8000,
        statusResists: {"1": 100, "2": 80, "3": 2500, "4": 0},
        damageResists: {"1": 45, "2": 45, "3": 80},
        awards: [
          {"name": "Половина воровского медальона №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-3-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Кусок карты №1", "img": "https://media.prison.coffee.agency/test455/items/smuggler/map-piece-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Мокасины 'Шаги к успеху'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/feet-nurlyz.png", "rarity": "Rare"}, 
          {"name": "Штаны 'Миллионер'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/pants-nurlyz.png", "rarity": "Rare"}, 
          {"name": "Чернильный клинок", "img": "https://media.prison.coffee.agency/test455/items/weapons/ink-blade.png", "rarity": "Epic"}],
      },
      hard: {
        hp: 500000, dmgMin: 140, dmgMax: 185,
        armor: 60, evasion: 110, accuracy: 50,
        critChance: 30, critDmg: 110,
        cost: 12000,
        statusResists: {"1": 170, "2": 80, "3": 3500, "4": 0},
        damageResists: {"1": 45, "2": 45, "3": 80},
        awards: [
          {"name": "Половина воровского медальона №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-3-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Кусок карты №1", "img": "https://media.prison.coffee.agency/test455/items/smuggler/map-piece-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Мокасины 'Шаги к успеху'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/feet-nurlyz.png", "rarity": "Rare"}, 
          {"name": "Штаны 'Миллионер'", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/nurlyz/pants-nurlyz.png", "rarity": "Rare"}, 
          {"name": "Чернильный клинок", "img": "https://media.prison.coffee.agency/test455/items/weapons/ink-blade.png", "rarity": "Epic"}],
      },
      blat: {
        hp: 575000, dmgMin: 180, dmgMax: 230,
        armor: 65, evasion: 120, accuracy: 150,
        critChance: 30, critDmg: 130,
        cost: 15000,
        statusResists: {"1": 170, "2": 80, "3": 3500, "4": 0},
        damageResists: {"1": 45, "2": 45, "3": 80},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Нурлыза.", img: "https://media.prison.coffee.agency/items/other/medal_boss_nurlyz.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "zahar",
    name: "Захар",
    img: "https://media.prison.coffee.agency/bosses/zahar/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/zahar/image.png",
    desc: "Захар — это босс, который может быть очень опасным. Он может быть очень опасным.",
    requiredLvl: 25,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 500000, dmgMin: 120, dmgMax: 160,
        armor: 25, evasion: 55, accuracy: 30,
        critChance: 0, critDmg: 0,
        cost: 30000,
        statusResists: {"1": 30, "2": 70, "3": 4000, "4": 0},
        damageResists: {"1": 25, "2": 25, "3": 12},
        awards: [{"sigs": "50000–70000"}, 
          {"name": "Половина воровского медальона №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-3-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Очки Захара", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/glasses-zakhar.png", "rarity": "Uncommon"}, 
          {"name": "Шорты Pipe", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/pants-zakhar.png", "rarity": "Uncommon"}, 
          {"name": "Футболка Pipe", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/body-zakhar.png", "rarity": "Uncommon"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Кокос", "img": "https://media.prison.coffee.agency/test455/items/boosts/coconut.png", "rarity": "Common"}],
      },
      normal: {
        hp: 700000, dmgMin: 160, dmgMax: 220,
        armor: 32, evasion: 65, accuracy: 40,
        critChance: 0, critDmg: 110,
        cost: 35000,
        statusResists: {"1": 50, "2": 85, "3": 5000, "4": 0},
        damageResists: {"1": 25, "2": 25, "3": 12},
        awards: [ 
          {"name": "Половина медальона неприкасаемости №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-2-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Очки Захара", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/glasses-zakhar.png", "rarity": "Rare"}, 
          {"name": "Шорты Pipe", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/pants-zakhar.png", "rarity": "Rare"}, 
          {"name": "Футболка Pipe", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/body-zakhar.png", "rarity": "Rare"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Кокос", "img": "https://media.prison.coffee.agency/test455/items/boosts/coconut.png", "rarity": "Common"}],
      },
      hard: {
        hp: 1000000, dmgMin: 200, dmgMax: 280,
        armor: 40, evasion: 70, accuracy: 50,
        critChance: 0, critDmg: 130,
        cost: 40000,
        statusResists: {"1": 60, "2": 95, "3": 6000, "4": 0},
        damageResists: {"1": 27, "2": 27, "3": 16},
        awards: [ 
          {"name": "Половина медальона неприкасаемости №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-2-part-1.png", "rarity": "Legendary", "qty": "1"},  
          {"name": "Очки Захара", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/glasses-zakhar.png", "rarity": "Epic"}, 
          {"name": "Шорты Pipe", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/pants-zakhar.png", "rarity": "Epic"}, 
          {"name": "Футболка Pipe", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/zakhar/body-zakhar.png", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Кокос", "img": "https://media.prison.coffee.agency/test455/items/boosts/coconut.png", "rarity": "Common"}],
      },
      blat: {
        hp: 1200000, dmgMin: 250, dmgMax: 350,
        armor: 45, evasion: 75, accuracy: 100,
        critChance: 10, critDmg: 150,
        cost: 50000,
        statusResists: {"1": 60, "2": 95, "3": 6000, "4": 0},
        damageResists: {"1": 27, "2": 27, "3": 16},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Захара.", img: "https://media.prison.coffee.agency/items/other/medal_boss_zahar.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "dipipi",
    name: "Ди' Пипи",
    img: "https://media.prison.coffee.agency/bosses/dipipi/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/dipipi/image.png",
    desc: "Ди' Пипи — это босс, который может быть очень опасным. Он может быть очень опасным.",
    requiredLvl: 30,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Кровотечение"],
    difficulties: {
      easy: {
        hp: 1500000, dmgMin: 160, dmgMax: 200,
        armor: 75, evasion: 75, accuracy: 30,
        critChance: 0, critDmg: 0,
        cost: 40000,
        statusResists: {"1": 300, "2": 15, "3": 3500, "4": 0},
        damageResists: {"1": 35, "2": 35, "3": 15},
        awards: [{"sigs": "40000–60000"}, 
          {"name": "Половина медальона неприкасаемости №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-2-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Кувалда Дипипи", "img": "https://media.prison.coffee.agency/items/weapons/sledgehammer.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Футболка павшего рэпера", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/body-dipipi.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Шорты павшего рэпера", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/pants-dipipi.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Эпический точильный камень", "img": "https://media.prison.coffee.agency/test455/items/upgrade-stones/upgradestone_epic.webp", "rarity": "Epic"}, 
          {"name": "Эпические ножницы", "img": "https://media.prison.coffee.agency/test455/items/scissors/scissors_epic.png", "rarity": "Epic"}, 
          {"name": "Фиолетовые нитки", "img": "https://media.prison.coffee.agency/test455/items/threads/thread_purple.webp", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Жареная курица", "img": "https://media.prison.coffee.agency/test455/items/boosts/fried_chicken.png", "rarity": "Common"}],
      },
      normal: {
        hp: 2000000, dmgMin: 220, dmgMax: 260,
        armor: 100, evasion: 90, accuracy: 50,
        critChance: 0, critDmg: 110,
        cost: 45000,
        statusResists: {"1": 300, "2": 0, "3": 4000, "4": 0},
        damageResists: {"1": 35, "2": 35, "3": 15},
        awards: [
          {"name": "Половина медальона неприкасаемости №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-2-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Кувалда Дипипи", "img": "https://media.prison.coffee.agency/items/weapons/sledgehammer.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Футболка павшего рэпера", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/body-dipipi.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Шорты павшего рэпера", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/pants-dipipi.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Эпический точильный камень", "img": "https://media.prison.coffee.agency/test455/items/upgrade-stones/upgradestone_epic.webp", "rarity": "Epic"}, 
          {"name": "Эпические ножницы", "img": "https://media.prison.coffee.agency/test455/items/scissors/scissors_epic.png", "rarity": "Epic"}, 
          {"name": "Фиолетовые нитки", "img": "https://media.prison.coffee.agency/test455/items/threads/thread_purple.webp", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Жареная курица", "img": "https://media.prison.coffee.agency/test455/items/boosts/fried_chicken.png", "rarity": "Common"}],
      },
      hard: {
        hp: 3000000, dmgMin: 250, dmgMax: 350,
        armor: 130, evasion: 95, accuracy: 60,
        critChance: 0, critDmg: 130,
        cost: 50000,
        statusResists: {"1": 300, "2": 95, "3": 5000, "4": 0},
        damageResists: {"1": 45, "2": 45, "3": 30},
        awards: [
          {"name": "Половина медальона Душ №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-1-part-1.png", "rarity": "Legendary", "qty": "1"},
          {"name": "Кувалда Дипипи", "img": "https://media.prison.coffee.agency/items/weapons/sledgehammer.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Футболка павшего рэпера", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/body-dipipi.png", "rarity": "Epic", "qty": "1"}, 
          {"name": "Шорты павшего рэпера", "img": "https://media.prison.coffee.agency/test455/items/body/bosses/dipipi/pants-dipipi.png", "rarity": "Epic", "qty": "1"}, 
          {"name": "Эпический точильный камень", "img": "https://media.prison.coffee.agency/test455/items/upgrade-stones/upgradestone_epic.webp", "rarity": "Epic"}, 
          {"name": "Эпические ножницы", "img": "https://media.prison.coffee.agency/test455/items/scissors/scissors_epic.png", "rarity": "Epic"}, 
          {"name": "Фиолетовые нитки", "img": "https://media.prison.coffee.agency/test455/items/threads/thread_purple.webp", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Жареная курица", "img": "https://media.prison.coffee.agency/test455/items/boosts/fried_chicken.png", "rarity": "Common"}],
      },
      blat: {
        hp: 3450000, dmgMin: 340, dmgMax: 475,
        armor: 140, evasion: 100, accuracy: 150,
        critChance: 0, critDmg: 160,
        cost: 70000,
        statusResists: {"1": 300, "2": 95, "3": 5000, "4": 0},
        damageResists: {"1": 45, "2": 45, "3": 30},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Дипипи.", img: "https://media.prison.coffee.agency/items/other/medal_boss_foma.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "foma",
    name: "Foma",
    img: "https://media.prison.coffee.agency/bosses/foma/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/foma/image.png",
    desc: "Фома",
    requiredLvl: 31,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 2500000, dmgMin: 320, dmgMax: 365,
        armor: 40, evasion: 38, accuracy: 180,
        critChance: 0, critDmg: 0,
        cost: 65000,
        statusResists: {"1": 0, "2": 0, "3": 4500, "4": 0},
        damageResists: {"1": 0, "2": 0, "3": 0},
        awards: [{"sigs": "145000–165000"}, 
          {"name": "Половина медальона кабана", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-4-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Стальная бита", "img": "https://media.prison.coffee.agency/items/weapons/foma_steel_bat.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Кожанка Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/leather-jacket.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Джинсы Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/jeans.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Лакированные туфли Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/patent-shoes.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Золотые часы Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/watches/foma-golden-watch.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Фишка Чистки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-removal.png", "rarity": "Common"}, 
          {"name": "Фишка Подгона", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-addition.png", "rarity": "Uncommon"}, 
          {"name": "Фишка Жертвы", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-sacrifice.png", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Набор первой помощи", "img": "https://media.prison.coffee.agency/test455/items/boosts/first_aid_kit.png", "rarity": "Common"}],
      },
      normal: {
        hp: 4000000, dmgMin: 380, dmgMax: 470,
        armor: 45, evasion: 40, accuracy: 300,
        critChance: 0, critDmg: 110,
        cost: 70000,
        statusResists: {"1": 0, "2": 0, "3": 5000, "4": 0},
        damageResists: {"1": 15, "2": 15, "3": 15},
        awards: [
          {"name": "Половина медальона кабана", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-4-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Стальная бита", "img": "https://media.prison.coffee.agency/items/weapons/foma_steel_bat.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Кожанка Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/leather-jacket.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Джинсы Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/jeans.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Лакированные туфли Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/patent-shoes.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Золотые часы Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/watches/foma-golden-watch.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Фишка обнуления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-purge.png", "rarity": "Rare"}, 
          {"name": "Фишка замены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-replacement.png", "rarity": "Rare"}, 
          {"name": "Фишка мешалки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-shuffle.png", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Набор первой помощи", "img": "https://media.prison.coffee.agency/test455/items/boosts/first_aid_kit.png", "rarity": "Common"}],
      },
      hard: {
        hp: 5000000, dmgMin: 470, dmgMax: 560,
        armor: 70, evasion: 90, accuracy: 450,
        critChance: 0, critDmg: 130,
        cost: 80000,
        statusResists: {"1": 0, "2": 0, "3": 6500, "4": 0},
        damageResists: {"1": 25, "2": 25, "3": 25},
        awards: [
          {"name": "Половина медальона кабана", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-4-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Стальная бита", "img": "https://media.prison.coffee.agency/items/weapons/foma_steel_bat.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Кожанка Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/leather-jacket.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Джинсы Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/jeans.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Лакированные туфли Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/foma/patent-shoes.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Золотые часы Фомы", "img": "https://media.prison.coffee.agency/test455/items/body/watches/foma-golden-watch.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Фишка усиления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-boost.png", "rarity": "Legendary"}, 
          {"name": "Фишка смены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-switch.png", "rarity": "Legendary"}, 
          {"name": "Фишка стирки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-erase.png", "rarity": "Legendary"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Набор первой помощи", "img": "https://media.prison.coffee.agency/test455/items/boosts/first_aid_kit.png", "rarity": "Common"}],
      },
      blat: {
        hp: 5500000, dmgMin: 560, dmgMax: 700,
        armor: 75, evasion: 95, accuracy: 520,
        critChance: 0, critDmg: 160,
        cost: 100000,
        statusResists: {"1": 0, "2": 0, "3": 6500, "4": 0},
        damageResists: {"1": 25, "2": 25, "3": 25},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Фомы.", img: "https://media.prison.coffee.agency/items/other/medal_boss_foma.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "iceman",
    name: "Шайба",
    img: "https://media.prison.coffee.agency/bosses/iceman/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/iceman/image.png",
    desc: "Шайба — бывший хоккеист, чья ярость на льду была так же холодна, как и безжалостна. Теперь в тюрьме его шайба летает между врагами, удваивая урон и сея хаос.",
    requiredLvl: 33,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Кровотечение"],
    difficulties: {
      easy: {
        hp: 1900000, dmgMin: 340, dmgMax: 430,
        armor: 130, evasion: 55, accuracy: 300,
        critChance: 5, critDmg: 0,
        cost: 80000,
        statusResists: {"1": 100, "2": 45, "3": 4500, "4": -15},
        damageResists: {"1": 32, "2": 40, "3": 30},
        awards: [{"sigs": "160000–180000"}, 
          {"name": "Половина медальона порядка №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-5-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Клюшка Шайбы", "img": "https://media.prison.coffee.agency/test455/items/weapons/hockey_stick.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Хоккейная защита", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/body-protection.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Хоккейные перчатки", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/gloves.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Жареная курица", "img": "https://media.prison.coffee.agency/test455/items/boosts/fried_chicken.png", "rarity": "Common"}],
      },
      normal: {
        hp: 2400000, dmgMin: 400, dmgMax: 530,
        armor: 140, evasion: 65, accuracy: 360,
        critChance: 8, critDmg: 90,
        cost: 150000,
        statusResists: {"1": 160, "2": 70, "3": 6000, "4": -10},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [
          {"name": "Половина медальона порядка №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-5-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Клюшка Шайбы", "img": "https://media.prison.coffee.agency/test455/items/weapons/hockey_stick.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Хоккейная защита", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/body-protection.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Хоккейные перчатки", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/gloves.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Хоккейная маска", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/helmet.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Фишка обнуления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-purge.png", "rarity": "Rare"}, 
          {"name": "Фишка замены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-replacement.png", "rarity": "Rare"}, 
          {"name": "Фишка мешалки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-shuffle.png", "rarity": "Epic"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Жареная курица", "img": "https://media.prison.coffee.agency/test455/items/boosts/fried_chicken.png", "rarity": "Common"}],
      },
      hard: {
        hp: 3200000, dmgMin: 490, dmgMax: 650,
        armor: 180, evasion: 90, accuracy: 400,
        critChance: 10, critDmg: 130,
        cost: 150000,
        statusResists: {"1": 220, "2": 100, "3": 8000, "4": -5},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [
          {"name": "Половина медальона порядка №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-5-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Клюшка Шайбы", "img": "https://media.prison.coffee.agency/test455/items/weapons/hockey_stick.png", "rarity": "Rare", "qty": "1"}, 
          {"name": "Хоккейная защита", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/body-protection.png", "rarity": "Epic", "qty": "1"}, 
          {"name": "Хоккейные перчатки", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/gloves.png", "rarity": "Epic", "qty": "1"}, 
          {"name": "Хоккейная маска", "img": "https://media.prison.coffee.agency/test455/items/body/hockey/helmet.png", "rarity": "Epic", "qty": "1"}, 
          {"name": "Фишка усиления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-boost.png", "rarity": "Legendary"}, 
          {"name": "Фишка смены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-switch.png", "rarity": "Legendary"}, 
          {"name": "Фишка стирки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-erase.png", "rarity": "Legendary"}, 
          {"name": "Чифир", "img": "https://media.prison.coffee.agency/test455/items/boosts/chifir_1.webp", "rarity": "Common"}, 
          {"name": "Жареная курица", "img": "https://media.prison.coffee.agency/test455/items/boosts/fried_chicken.png", "rarity": "Common"}],
      },
      blat: {
        hp: 3700000, dmgMin: 495, dmgMax: 625,
        armor: 210, evasion: 100, accuracy: 450,
        critChance: 10, critDmg: 170,
        cost: 180000,
        statusResists: {"1": 220, "2": 100, "3": 8000, "4": 0},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Шайбы.", img: "https://media.prison.coffee.agency/items/other/medal_boss_iceman.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "burnman",
    name: "Паяльник",
    img: "https://media.prison.coffee.agency/bosses/burnman/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/burnman/image.png",
    desc: "Паяльник — мастер огня и металла, чья паяльная лампа способна расплавить сталь и души. Его жар постоянно растёт, делая его всё более опасным.",
    requiredLvl: 35,
    cooldown: 8,
    maxPhase: 2,
    imm: ["Поджог"],
    difficulties: {
      easy: {
        hp: 2000000, dmgMin: 390, dmgMax: 450,
        armor: 220, evasion: 55, accuracy: 330,
        critChance: 5, critDmg: 10,
        cost: 100000,
        statusResists: {"1": 150, "2": 60, "3": 4500, "4": 100},
        damageResists: {"1": 32, "2": 40, "3": 30},
        awards: [{"sigs": "160000–180000"}, 
          {"name": "Половина медальона тишины №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-6-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Паяльник", "img": "https://media.prison.coffee.agency/items/weapons/soldering_iron.png", "rarity": "Common", "qty": "1"}, 
          {"name": "Пиджак из кожи крокодила", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-jacket.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Брюки Паяльника", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-pants.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Туфли из кожи крокодила", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-shoes.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Фишка Чистки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-removal.png", "rarity": "Common"}, 
          {"name": "Фишка Подгона", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-addition.png", "rarity": "Uncommon"}, 
          {"name": "Фишка Жертвы", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-sacrifice.png", "rarity": "Epic"}],
      },
      normal: {
        hp: 2500000, dmgMin: 450, dmgMax: 500,
        armor: 260, evasion: 70, accuracy: 380,
        critChance: 8, critDmg: 70,
        cost: 150000,
        statusResists: {"1": 200, "2": 90, "3": 5000, "4": 300},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [
          {"name": "Половина медальона тишины №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-6-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Паяльник", "img": "https://media.prison.coffee.agency/items/weapons/soldering_iron.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Пиджак из кожи крокодила", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-jacket.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Брюки Паяльника", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-pants.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Туфли из кожи крокодила", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-shoes.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Фишка обнуления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-purge.png", "rarity": "Rare"}, 
          {"name": "Фишка замены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-replacement.png", "rarity": "Rare"}, 
          {"name": "Фишка мешалки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-shuffle.png", "rarity": "Epic"}], 
      },
      hard: {
        hp: 3000000, dmgMin: 500, dmgMax: 550,
        armor: 300, evasion: 80, accuracy: 480,
        critChance: 10, critDmg: 120,
        cost: 200000,
        statusResists: {"1": 250, "2": 120, "3": 8000, "4": 600},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [
          {"name": "Половина медальона тишины №1", "img": "https://media.prison.coffee.agency/items/smuggler/medallion-6-part-1.png", "rarity": "Legendary", "qty": "1"}, 
          {"name": "Паяльник", "img": "https://media.prison.coffee.agency/items/weapons/soldering_iron.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Пиджак из кожи крокодила", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-jacket.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Брюки Паяльника", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-pants.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Туфли из кожи крокодила", "img": "https://media.prison.coffee.agency/test455/items/body/burnman/crocodile-shoes.png", "rarity": "Uncommon", "qty": "1"}, 
          {"name": "Фишка усиления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-boost.png", "rarity": "Legendary"}, 
          {"name": "Фишка смены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-switch.png", "rarity": "Legendary"}, 
          {"name": "Фишка стирки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-erase.png", "rarity": "Legendary"}], 
      },
      blat: {
        hp: 3500000, dmgMin: 500, dmgMax: 550,
        armor: 330, evasion: 90, accuracy: 530,
        critChance: 10, critDmg: 160,
        cost: 250000,
        statusResists: {"1": 250, "2": 120, "3": 8000, "4": 600},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Паяльника.", img: "https://media.prison.coffee.agency/items/other/medal_boss_burnman.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
  {
    id: "vito",
    name: "Вито",
    img: "https://media.prison.coffee.agency/bosses/vito/preview.png",
    imgFull: "https://media.prison.coffee.agency/bosses/vito/image.png",
    desc: "Вито — криминальный авторитет, ведущий долговые книги тюрьмы. За каждый нанесённый ему урон он записывает долг, а за свои услуги требует залог — ваши способности.",
    requiredLvl: 39,
    cooldown: 8,
    maxPhase: 2,
    imm: [],
    difficulties: {
      easy: {
        hp: 7500000, dmgMin: 450, dmgMax: 500,
        armor: 150, evasion: 90, accuracy: 600,
        critChance: 20, critDmg: 90,
        cost: 300000,
        statusResists: {"1": 250, "2": 180, "3": 9000, "4": 300},
        damageResists: {"1": 32, "2": 40, "3": 30},
        awards: [{"sigs": "480000–540000"}, 
          {"name": "Пиджак Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/suit.png", "rarity": "Uncommon"}, 
          {"name": "Брюки Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/pants.png", "rarity": "Uncommon"}, 
          {"name": "Туфли Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/shoes.png", "rarity": "Uncommon"}, 
          {"name": "Фишка Чистки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-removal.png", "rarity": "Common"}, 
          {"name": "Фишка Подгона", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-addition.png", "rarity": "Uncommon"}, 
          {"name": "Фишка Жертвы", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-sacrifice.png", "rarity": "Epic"}],
      },
      normal: {
        hp: 10000000, dmgMin: 500, dmgMax: 550,
        armor: 190, evasion: 110, accuracy: 700,
        critChance: 23, critDmg: 150,
        cost: 450000,
        statusResists: {"1": 300, "2": 270, "3": 10000, "4": 900},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [{"sigs": "510000–570000"}, 
          {"name": "Пиджак Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/suit.png", "rarity": "Uncommon"}, 
          {"name": "Брюки Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/pants.png", "rarity": "Uncommon"}, 
          {"name": "Туфли Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/shoes.png", "rarity": "Uncommon"},
          {"name": "Фишка обнуления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-purge.png", "rarity": "Rare"}, 
          {"name": "Фишка замены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-replacement.png", "rarity": "Rare"}, 
          {"name": "Фишка мешалки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-shuffle.png", "rarity": "Epic"}], 
      },
      hard: {
        hp: 15000000, dmgMin: 600, dmgMax: 700,
        armor: 230, evasion: 130, accuracy: 780,
        critChance: 25, critDmg: 200,
        cost: 600000,
        statusResists: {"1": 350, "2": 360, "3": 16000, "4": 1800},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [{"sigs": "510000–570000"}, 
          {"name": "Пиджак Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/suit.png", "rarity": "Rare"}, 
          {"name": "Брюки Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/pants.png", "rarity": "Rare"}, 
          {"name": "Туфли Вито", "img": "https://media.prison.coffee.agency/test455/items/body/bp4/classic/shoes.png", "rarity": "Rare"},
          {"name": "Фишка усиления", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-boost.png", "rarity": "Legendary"}, 
          {"name": "Фишка смены", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-switch.png", "rarity": "Legendary"}, 
          {"name": "Фишка стирки", "img": "https://media.prison.coffee.agency/test455/items/spheres/sphere-erase.png", "rarity": "Legendary"}], 
      },
      blat: {
        hp: 13000000, dmgMin: 500, dmgMax: 680,
        armor: 200, evasion: 130, accuracy: 795,
        critChance: 25, critDmg: 240,
        cost: 750000,
        statusResists: {"1": 400, "2": 360, "3": 16000, "4": 1800},
        damageResists: {"1": 40, "2": 50, "3": 45},
        awards: [{ name: "Шанс X2 (От базового) на награды с тяжелого.", rarity: "Legendary", qty: "1" },
        { name: "Медаль Вито.", img: "https://media.prison.coffee.agency/items/other/medal_boss_vito.png", rarity: "Legendary", qty: "1" },],
      },
    },
  },
];

// ─── render helpers ────────────────────────────────────────────
const DIFF_KEYS   = ["easy","normal","hard","blat"];
const DIFF_LABELS = { easy:"Лёгкая", normal:"Средняя", hard:"Тяжёлая", blat:"Блатной" };
const DIFF_COLORS = { easy:"var(--ok)", normal:"var(--blue2)", hard:"var(--amber)", blat:"#e74c3c" };
const DIFF_ICONS  = { easy:"⭐", normal:"⭐⭐", hard:"⭐⭐⭐", blat:"💀" };

const RARITY_COLOR = {
  Common:"var(--text-ghost)", Uncommon:"var(--ok)", Rare:"var(--blue2)",
  Epic:"var(--purple,#9b59b6)", Legendary:"var(--amber)",
};

function fmtHp(n) {
  if (n==null) return "?";
  if (n>=1000000) return (n/1000000).toFixed(1).replace(".0","")+"М";
  if (n>=1000)    return (n/1000).toFixed(0)+"К";
  return String(n);
}

const HP_MAX = Math.max(...BOSSES.flatMap(b =>
  DIFF_KEYS.map(k => b.difficulties[k]?.hp || 0)));

function rarityDot(r) {
  const c = RARITY_COLOR[r] || "var(--text-ghost)";
  return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${c};flex-shrink:0;"></span>`;
}

function renderAwards(awards) {
  if (!awards || !awards.length) return "";
  const parts = awards.map(a => {
    if (a.oneOf) {
      const names = a.oneOf.map(x =>
        `<div style="display:flex;align-items:center;gap:4px;">${x.img?`<img src="${esc(x.img)}" style="width:18px;height:18px;object-fit:contain;" />`:""}${rarityDot(x.rarity)}<span>${esc(x.name)}</span></div>`
      ).join("");
      return `<div class="boss-award-oneof"><div class="boss-award-oneof-label"></div>${names}</div>`;
    }
    if (a.sigs) return `<div class="boss-award-row">🚬 <span>${typeof a.sigs==="number"?a.sigs.toLocaleString("ru-RU"):a.sigs} сиг</span></div>`;
    if (a.name) return `<div class="boss-award-row">${a.img?`<img src="${esc(a.img)}" style="width:22px;height:22px;object-fit:contain;border-radius:4px;" />`:""}${rarityDot(a.rarity)}<span>${esc(a.name)}${a.qty&&a.qty!=="1"?` ×${a.qty}`:""}</span></div>`;
    return "";
  }).filter(Boolean);
  return `<div class="boss-awards">${parts.join("")}</div>`;
}

export async function renderBosses() {
  const root = document.createElement("div");
  root.className = "bosses-page";

  const state = { search:"", selected:null, diff:"easy" };

  root.innerHTML = `
    <div class="card">
      <div class="row">
        <div>
          <div class="card-title">👹 БОССЫ</div>
          <div class="card-sub">Статы · Иммунитеты · Дроп по сложностям</div>
        </div>
        <span class="badge amber">${BOSSES.length} боссов</span>
      </div>
    </div>
    <div class="card no-accent" style="padding:12px 14px;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <div class="search-wrap" style="flex:1;min-width:160px;">
          <span class="search-icon">🔍</span>
          <input class="input" id="bossSearch" placeholder="Поиск босса..." style="padding-left:36px;" />
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;" id="diffBar">
          ${DIFF_KEYS.map(k=>`
            <button class="boss-diff-btn ${k===state.diff?"active":""}" data-diff="${k}" type="button">
              ${DIFF_ICONS[k]} ${DIFF_LABELS[k]}
            </button>`).join("")}
        </div>
      </div>
    </div>
    <div class="bosses-layout">
      <div class="card no-accent bosses-list" style="padding:0;" id="bossesList"></div>
      <div class="card bosses-detail" id="bossDetail">
        <div style="text-align:center;padding:32px 16px;color:var(--text-ghost);">
          <div style="font-size:36px;margin-bottom:8px;">👹</div><div>Выбери босса слева</div>
        </div>
      </div>
    </div>
    <div class="card no-accent" style="padding:10px 16px;">
      <div class="muted" style="font-size:12px;">
        💀 <b>Блатной</b> — единственная сложность где падают медали ·
        Дроп = награда за <b>победу</b> на каждой сложности
      </div>
    </div>`;

  root.querySelector("#diffBar").addEventListener("click", e => {
    const btn = e.target.closest("[data-diff]");
    if (!btn) return;
    state.diff = btn.dataset.diff;
    root.querySelectorAll(".boss-diff-btn").forEach(b =>
      b.classList.toggle("active", b.dataset.diff === state.diff));
    renderList();
    if (state.selected) renderDetail(BOSSES.find(b => b.id === state.selected));
  });

  const searchEl = root.querySelector("#bossSearch");
  searchEl.addEventListener("input", () => {
    clearTimeout(searchEl._t);
    searchEl._t = setTimeout(() => { state.search = searchEl.value.toLowerCase().trim(); renderList(); }, 150);
  });

  function renderList() {
    const list = BOSSES.filter(b => !state.search || b.name.toLowerCase().includes(state.search));
    const el   = root.querySelector("#bossesList");
    const dc   = DIFF_COLORS[state.diff];

    if (!list.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Не найдено</div></div>`;
      return;
    }

    el.innerHTML = list.map(b => {
      const d  = b.difficulties[state.diff];
      const isActive = state.selected === b.id;
      const immBadges = b.imm.length
        ? b.imm.map(i => `<span class="bl-imm-chip">${esc(i)}</span>`).join("")
        : "";
      const critStr = d.critChance ? `💥${d.critChance}%` : "";
      const evaStr  = d.evasion    ? `👟${d.evasion}%`    : "";
      return `
        <div class="bl-row ${isActive?"active":""}" data-boss="${esc(b.id)}">
          <div class="bl-img-wrap">
            ${b.img
              ? `<img src="${esc(b.img)}" class="bl-img" loading="lazy" />`
              : `<div class="bl-img-ph">👹</div>`}
            <div class="bl-lvl">Ур.${b.requiredLvl}</div>
          </div>
          <div class="bl-body">
            <div class="bl-top">
              <span class="bl-name">${esc(b.name)}</span>
              ${state.diff==="blat" ? `<span class="bl-blat-chip">💀 Блатной</span>` : ""}
            </div>
            ${immBadges ? `<div class="bl-imms">${immBadges}</div>` : ""}
            <div class="bl-stats">
              <span class="bl-stat hp" style="color:${dc};">❤️ ${fmtHp(d.hp)}</span>
              <span class="bl-stat">⚔️ ${d.dmgMin}–${d.dmgMax}</span>
              <span class="bl-stat">🛡 ${d.armor}</span>
              ${evaStr  ? `<span class="bl-stat">${evaStr}</span>`  : ""}
              ${critStr ? `<span class="bl-stat">${critStr}</span>` : ""}
              ${d.cost  ? `<span class="bl-stat cost">🚬 ${d.cost.toLocaleString("ru-RU")}</span>` : ""}
            </div>
            <div class="bl-hpbar"><div class="bl-hpfill" style="width:${Math.min(100,Math.round(d.hp/HP_MAX*100))}%;background:${dc};"></div></div>
          </div>
        </div>`;
    }).join("");

    el.querySelectorAll("[data-boss]").forEach(row => {
      row.addEventListener("click", () => {
        state.selected = row.dataset.boss;
        renderList();
        renderDetail(BOSSES.find(b => b.id === state.selected));
      });
    });
  }

  function renderDetail(b) {
    const el = root.querySelector("#bossDetail");
    if (!b) return;

    const diffCards = DIFF_KEYS.map(k => {
      const d  = b.difficulties[k];
      const dc = DIFF_COLORS[k];
      const isCur = k === state.diff;
      return `
        <div class="boss-diff-card ${isCur?"current":""}">
          <div class="boss-diff-card-head" style="color:${dc};">
            ${DIFF_ICONS[k]} ${DIFF_LABELS[k]}
            ${k==="blat"?`<span class="boss-blat-badge" style="margin-left:4px;">Медали</span>`:""}
            ${d.cost?`<span class="boss-cost">🚬${d.cost.toLocaleString("ru-RU")}</span>`:""}
          </div>
          <div class="boss-diff-stats">
            <div class="boss-diff-stat"><span>❤️ HP</span><b style="color:${dc};">${fmtHp(d.hp)}</b></div>
            <div class="boss-diff-stat"><span>⚔️ Урон</span><b>${d.dmgMin}–${d.dmgMax}</b></div>
            <div class="boss-diff-stat"><span>🛡 Броня</span><b>${d.armor}</b></div>
            <div class="boss-diff-stat"><span>👣 Уклон</span><b>${d.evasion}%</b></div>
            <div class="boss-diff-stat"><span>🎯 Точность</span><b>${d.accuracy}</b></div>
            ${d.critChance?`<div class="boss-diff-stat"><span>💥 Крит</span><b>${d.critChance}%/${d.critDmg}%</b></div>`:""}
          </div>
          ${d.awards&&d.awards.length?`
            <div class="boss-diff-drop-title">🎁 победа:</div>
            ${renderAwards(d.awards)}
          `:""}
        </div>`;
    }).join("");

    el.innerHTML = `
      ${b.imgFull ? `<div class="boss-full-img-wrap"><img src="${esc(b.imgFull)}" class="boss-full-img" alt="${esc(b.name)}" /></div>` : ""}
      <div class="boss-detail-head">
        ${!b.imgFull ? `<div class="boss-detail-ico" style="position:relative;">
          ${b.img ? `<img src="${esc(b.img)}" class="boss-detail-img" />` : `<div class="boss-detail-placeholder">👹</div>`}
        </div>` : ""}
        <div style="flex:1;min-width:0;">
          <div class="card-title" style="font-size:20px;">${esc(b.name)}</div>
          <div class="muted" style="font-size:11px;margin-top:2px;">Уровень ${b.requiredLvl}+ · Кулдаун ${b.cooldown}ч</div>
          ${b.imm.length?`
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">
              <span class="muted" style="font-size:10px;align-self:center;">🛡 Иммун:</span>
              ${b.imm.map(i=>`<span class="boss-imm-badge">${esc(i)}</span>`).join("")}
            </div>`:""}
        </div>
      </div>
      ${b.desc?`<div class="boss-lore">${esc(b.desc)}</div>`:""}
      <div class="hr"></div>
      <div class="boss-diff-grid">${diffCards}</div>
    `;
  }

  renderList();
  return root;
}
