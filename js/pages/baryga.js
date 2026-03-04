
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

const LEVELS = [
  { lv:1,  sigs:5000,   kop:50,   silv:0,   chirk:0,   item:"Ботинки «Побег»",                    rar:"uncommon"  },
  { lv:2,  sigs:10000,  kop:170,  silv:0,   chirk:0,   item:"Штаны «Побег»",                      rar:"uncommon"  },
  { lv:3,  sigs:15000,  kop:290,  silv:0,   chirk:0,   item:"Рубашка «Побег»",                    rar:"uncommon"  },
  { lv:4,  sigs:20000,  kop:410,  silv:0,   chirk:0,   item:"Шапка «Побег»",                      rar:"uncommon"  },
  { lv:5,  sigs:0,      kop:530,  silv:110, chirk:0,   item:"Застывшая кровь + Медаль Кучерявого", rar:"legendary"},
  { lv:6,  sigs:50000,  kop:650,  silv:130, chirk:0,   item:"Козырёк «Abibas Sharp»",             rar:"rare"      },
  { lv:7,  sigs:0,      kop:770,  silv:150, chirk:0,   item:"Куртка «Abibas» + Медаль Банкира",   rar:"legendary" },
  { lv:8,  sigs:60000,  kop:890,  silv:180, chirk:0,   item:"Шорты Ашаба",                        rar:"uncommon"  },
  { lv:9,  sigs:0,      kop:1010, silv:200, chirk:50,  item:"Шорты Ашаба + Медаль Ашаба",         rar:"legendary" },
  { lv:10, sigs:70000,  kop:1130, silv:230, chirk:60,  item:"99я проблема",                       rar:"uncommon"  },
  { lv:11, sigs:0,      kop:1250, silv:250, chirk:60,  item:"Очки дежавю + Медаль Олега",         rar:"legendary" },
  { lv:12, sigs:80000,  kop:1370, silv:270, chirk:70,  item:"Очки Макарона",                    rar:"uncommon"  },
  { lv:13, sigs:0,      kop:1490, silv:300, chirk:70,  item:"Очки Макарона + Медаль Арсена",    rar:"legendary" },
  { lv:14, sigs:90000,  kop:1610, silv:320, chirk:80,  item:"Куртка «Вечерка»",                   rar:"rare"      },
  { lv:15, sigs:0,      kop:1730, silv:350, chirk:90,  item:"Медаль Мистера Бизнеса",             rar:"legendary" },
  { lv:16, sigs:100000, kop:1850, silv:370, chirk:90,  item:"Куртка «Abibas»",                    rar:"rare"      },
  { lv:17, sigs:0,      kop:1970, silv:390, chirk:100, item:"Спортивки «Abibas» + Медаль Жана",   rar:"legendary" },
  { lv:18, sigs:120000, kop:2090, silv:420, chirk:100, item:"Куртка «Мавродий»",                  rar:"epic"      },
  { lv:19, sigs:0,      kop:2210, silv:440, chirk:110, item:"Штаны «Мавродий» + Медаль Сергея",   rar:"legendary" },
  { lv:20, sigs:140000, kop:2330, silv:470, chirk:120, item:"Чернильный клинок",                  rar:"rare"      },
  { lv:21, sigs:0,      kop:2450, silv:490, chirk:120, item:"Штаны «Миллионер» + Медаль Нурлыза", rar:"legendary" },
  { lv:22, sigs:160000, kop:2570, silv:510, chirk:130, item:"Очки Захара",                        rar:"uncommon"  },
  { lv:23, sigs:0,      kop:2690, silv:540, chirk:130, item:"Очки Захара + Медаль Захара",        rar:"legendary" },
  { lv:24, sigs:180000, kop:2810, silv:560, chirk:140, item:"Футболка павшего рэпера",            rar:"uncommon"  },
  { lv:25, sigs:0,      kop:2930, silv:590, chirk:150, item:"Медаль ДиПиПи",                      rar:"legendary" },
  { lv:26, sigs:200000, kop:3050, silv:610, chirk:150, item:"Стальная бита",                      rar:"uncommon"  },
  { lv:27, sigs:0,      kop:3170, silv:630, chirk:160, item:"Стальная бита + Медаль Фомы",        rar:"legendary" },
  { lv:28, sigs:250000, kop:3290, silv:660, chirk:170, item:"", rar:"" },
  { lv:29, sigs:300000, kop:3410, silv:680, chirk:170, item:"", rar:"" },
  { lv:30, sigs:350000, kop:3530, silv:710, chirk:180, item:"", rar:"" },
  { lv:31, sigs:400000, kop:3650, silv:730, chirk:180, item:"", rar:"" },
  { lv:32, sigs:450000, kop:3770, silv:750, chirk:190, item:"", rar:"" },
  { lv:33, sigs:500000, kop:3890, silv:780, chirk:190, item:"", rar:"" },
  { lv:34, sigs:600000, kop:4010, silv:800, chirk:200, item:"", rar:"" },
  { lv:35, sigs:700000, kop:4130, silv:830, chirk:210, item:"", rar:"" },
];

const LV_FIRST = {
  5:  "🆕 Серебро",
  8:  "🆕 Фишка Чистки",
  9:  "🆕 Метки · Чирки",
  14: "🆕 Чекушки",
  18: "🆕 Метки ярости",
  19: "🆕 Бутыли",
  29: "🆕 Топ-фишки",
};

const SHOP_ITEMS = [
  { lv:1,  name:"Стакан Вишнёвого Самогона",       kop:27,   silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/self_made_alcohol1.png" },
  { lv:2,  name:"Стакан Яблочного Самогона",        kop:30,   silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine1.png" },
  { lv:2,  name:"Стакан Медового Самогона",          kop:33,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine1.png" },
  { lv:3,  name:"Стакан Омывайки",                  kop:30,   silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/potato_moonshine1.png" },
  { lv:3,  name:"Стакан Облепихового Самогона",     kop:33,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/apple_moonshine1.png" },
  { lv:4,  name:"Стакан Черничного Самогона",       kop:30,   silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/rye_moonshine1.png" },
  { lv:4,  name:"Стакан Воды из лужи",              kop:40,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/honey_moonshine1.png" },
  { lv:5,  name:"Стакан Смородинового Самогона",    kop:40,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/currant_moonshine1.png" },
  { lv:5,  name:"Стакан Антисептика",               kop:33,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/sea_buckthorn_moonshine1.png" },
  { lv:6,  name:"Стакан Лавандового Самогона",      kop:43,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/rose_hip_moonshine1.png" },
  { lv:6,  name:"Стакан Берёзового Самогона",       kop:47,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/viburnum_moonshine1.png" },
  { lv:7,  name:"Стакан Рисового Самогона",         kop:43,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/test455/items/potions/birch_moonshine1.png" },
  { lv:7,  name:"Стакан Кумыса",                    kop:40,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/items/potions/walnut_moonshine1.png" },
  { lv:8,  name:"Стакан Браги",                     kop:50,  silv:0,   chirk:0,   qty:3, cat:"glass",     img:"https://media.prison.coffee.agency/items/potions/raspberry_moonshine1.png" },
  { lv:8,  name:"Фишка Чистки",                     kop:300,  silv:0,   chirk:0,   qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/test455/items/spheres/sphere-removal.png" },
  { lv:9,  name:"Малая метка крови",                kop:200,  silv:0,   chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/blood_small.png" },
  { lv:9,  name:"Малая метка иммунитета",           kop:200,  silv:0,   chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/immunity_small.png" },
  { lv:10, name:"Малая метка крита",                kop:200,  silv:0,   chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/crit_small.png" },
  { lv:10, name:"Малая метка здоровья",             kop:200,  silv:0,   chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/health_small.png" },
  { lv:11, name:"Средняя метка крови",              kop:400,  silv:80,  chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/blood_medium.png" },
  { lv:11, name:"Средняя метка иммунитета",         kop:400,  silv:80,  chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/immunity_medium.png" },
  { lv:12, name:"Средняя метка крита",              kop:400,  silv:80,  chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/crit_medium.png" },
  { lv:12, name:"Средняя метка здоровья",           kop:400,  silv:80,  chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/health_medium.png" },
  { lv:13, name:"Большая метка крови",              kop:700,  silv:140, chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/blood_large.png" },
  { lv:13, name:"Большая метка иммунитета",         kop:700,  silv:140, chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/immunity_large.png" },
  { lv:14, name:"Большая метка крита",              kop:700,  silv:140, chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/crit_large.png" },
  { lv:14, name:"Большая метка здоровья",           kop:700,  silv:140, chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/health_large.png" },
  { lv:14, name:"Чекушка Вишнёвого Самогона",       kop:80,  silv:17,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/items/potions/self_made_alcohol2.png" },
  { lv:15, name:"Бутылка Минеральной Воды",         kop:50,  silv:10,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/items/potions/mineral_water1.png" },
  { lv:15, name:"Чекушка Яблочного Самогона",       kop:73,  silv:13,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine2.png" },
  { lv:15, name:"Чекушка Медового Самогона",        kop:80,  silv:17,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine2.png" },
  { lv:16, name:"Чекушка Омывайки",                 kop:73,  silv:13,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/items/potions/potato_moonshine2.png" },
  { lv:16, name:"Чекушка Облепихового Самогона",    kop:80,  silv:17,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/items/potions/apple_moonshine2.png" },
  { lv:17, name:"Чекушка Черничного Самогона",      kop:73,  silv:13,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/test455/items/potions/rye_moonshine2.png" },
  { lv:17, name:"Чекушка Воды из лужи",             kop:93,  silv:20,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/test455/items/potions/honey_moonshine2.png" },
  { lv:18, name:"Чекушка Смородинового Самогона",   kop:280,  silv:60,  chirk:0,   qty:2, cat:"chekushka", img:"https://media.prison.coffee.agency/test455/items/potions/currant_moonshine2.png" },
  { lv:18, name:"Малая метка ярости",               kop:350,  silv:70,  chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/rage_small.png" },
  { lv:18, name:"Средняя метка ярости",             kop:600,  silv:120, chirk:0,   qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/rage_medium.png" },
  { lv:19, name:"Большая метка ярости",             kop:1000, silv:200, chirk:20,  qty:1, cat:"mark",      img:"https://media.prison.coffee.agency/test455/items/marks/rage_large.png" },
  { lv:19, name:"Бутыль Вишнёвого Самогона",        kop:600,  silv:280, chirk:25,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/self_made_alcohol3.png" },
  { lv:20, name:"Бутыль Яблочного Самогона",        kop:650,  silv:290, chirk:27,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine3.png" },
  { lv:21, name:"Бутыль Медового Самогона",         kop:670,  silv:300, chirk:30,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine3.png" },
  { lv:21, name:"Бутыль Омывайки",                  kop:690,  silv:320, chirk:31,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/potato_moonshine3.png" },
  { lv:22, name:"Бутыль Облепихового Самогона",     kop:700,  silv:350, chirk:32,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/apple_moonshine3.png" },
  { lv:22, name:"Бутыль Черничного Самогона",       kop:750,  silv:370, chirk:33,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/rye_moonshine3.png" },
  { lv:23, name:"Бутыль Воды из лужи",              kop:800,  silv:390, chirk:34,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/honey_moonshine3.png" },
  { lv:23, name:"Бутыль Смородинового Самогона",    kop:850,  silv:420, chirk:34,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/currant_moonshine3.png" },
  { lv:23, name:"Бутыль Антисептика",               kop:900,  silv:450, chirk:34,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/sea_buckthorn_moonshine3.png" },
  { lv:24, name:"Бутыль Лавандового Самогона",      kop:950,  silv:470, chirk:34,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/rose_hip_moonshine3.png" },
  { lv:25, name:"Бутыль Берёзового Самогона",       kop:1000, silv:480, chirk:34,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/viburnum_moonshine3.png" },
  { lv:25, name:"Бутыль Рисового Самогона",         kop:1100, silv:500, chirk:35,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/birch_moonshine3.png" },
  { lv:25, name:"Бутыль Кумыса",                    kop:1150, silv:530, chirk:37,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/walnut_moonshine3.png" },
  { lv:26, name:"Бутыль Браги",                     kop:1260, silv:550, chirk:38,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/items/potions/raspberry_moonshine3.png" },
  { lv:26, name:"Бутыль Вишнёвого Самогона ×2",     kop:1345, silv:580, chirk:39,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/self_made_alcohol3.png" },
  { lv:27, name:"Бутыль Яблочного Самогона ×2",     kop:1350, silv:600, chirk:40,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine3.png" },
  { lv:27, name:"Бутыль Медового Самогона ×2",      kop:1460, silv:650, chirk:42,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine3.png" },
  { lv:28, name:"Бутыль Омывайки ×2",               kop:1500, silv:670, chirk:43,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/potato_moonshine3.png" },
  { lv:28, name:"Бутыль Облепихового Самогона ×2",  kop:1600, silv:700, chirk:45,  qty:1, cat:"bottle",    img:"https://media.prison.coffee.agency/test455/items/potions/apple_moonshine3.png" },
  { lv:29, name:"Фишка Подгона",                    kop:1750, silv:825, chirk:87,  qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/test455/items/spheres/sphere-addition.png" },
  { lv:30, name:"Фишка Обнуления",                  kop:1800, silv:870, chirk:91,  qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/items/spheres/sphere-purge.png" },
  { lv:31, name:"Фишка Заточки",                    kop:1900, silv:900, chirk:100, qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/items/spheres/sphere-enhancement.png" },
  { lv:32, name:"Фишка Замены",                     kop:2000, silv:950, chirk:115, qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/items/spheres/sphere-replacement.png" },
  { lv:33, name:"Фишка Мешалки",                    kop:2100, silv:1000,chirk:120, qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/items/spheres/sphere-shuffle.png" },
  { lv:34, name:"Фишка Захвата",                    kop:2300, silv:1100,chirk:138, qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/items/spheres/sphere-pinning.png" },
  { lv:35, name:"Фишка Жертвы",                     kop:2400, silv:1200,chirk:145, qty:1, cat:"chip",      img:"https://media.prison.coffee.agency/items/spheres/sphere-sacrifice.png" },
];

const CONSUMABLES = [
  { name:"Стакан Вишнёвого Самогона",       type:"glass",     key:"vishnya",    effect:"Увеличивает урон на 10%",                              icon:"🍒", img:"https://media.prison.coffee.agency/test455/items/potions/self_made_alcohol1.png" },
  { name:"Стакан Яблочного Самогона",        type:"glass",     key:"yabloko",    effect:"Увеличивает здоровье на 15%",                                                    icon:"🍏", img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine1.png" },
  { name:"Стакан Медового Самогона",         type:"glass",     key:"med",        effect:"Ускоряет восстановление энергии на 20%",                                                    icon:"🍯", img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine1.png" },
  { name:"Стакан Омывайки",                 type:"glass",     key:"omyvajka",   effect:"Увеличивает броню на 15%",                             icon:"🧴", img:"https://media.prison.coffee.agency/test455/items/potions/potato_moonshine1.png" },
  { name:"Стакан Облепихового Самогона",    type:"glass",     key:"oblepiha",   effect:"Увеличивает критический урон на 20",                   icon:"🟠", img:"https://media.prison.coffee.agency/test455/items/potions/apple_moonshine1.png" },
  { name:"Стакан Черничного Самогона",      type:"glass",     key:"chernika",   effect:"Увеличивает уклонение на 15%",                                                    icon:"🫐", img:"https://media.prison.coffee.agency/test455/items/potions/rye_moonshine1.png" },
  { name:"Стакан Воды из лужи",             type:"glass",     key:"voda",       effect:"Увеличивает сопротивление яду на 10%",                                                    icon:"💧", img:"https://media.prison.coffee.agency/test455/items/potions/honey_moonshine1.png" },
  { name:"Стакан Смородинового Самогона",   type:"glass",     key:"smorodina",  effect:"Увеличивает сопротивление кровотечению на 10%",                                                    icon:"🍇", img:"https://media.prison.coffee.agency/test455/items/potions/currant_moonshine1.png" },
  { name:"Стакан Антисептика",              type:"glass",     key:"antiseptik", effect:"Восстанавливает 2% здоровья за ход",                   icon:"🟢", img:"https://media.prison.coffee.agency/test455/items/potions/sea_buckthorn_moonshine1.png" },
  { name:"Стакан Лавандового Самогона",     type:"glass",     key:"lavanda",    effect:"Неуязвимость на 1 ход после смерти",                   icon:"💜", img:"https://media.prison.coffee.agency/test455/items/potions/rose_hip_moonshine1.png" },
  { name:"Стакан Берёзового Самогона",      type:"glass",     key:"bereza",     effect:"Атаки наносят 15% урона по области",                   icon:"🌿", img:"https://media.prison.coffee.agency/test455/items/potions/viburnum_moonshine1.png" },
  { name:"Стакан Рисового Самогона",        type:"glass",     key:"ris",        effect:"Ускоряет восстановление боссов на 10%",                icon:"🍚", img:"https://media.prison.coffee.agency/test455/items/potions/birch_moonshine1.png" },
  { name:"Стакан Кумыса",                   type:"glass",     key:"kumys",      effect:"При промахе +10 урона за стак (макс. 20 стаков)",                                                    icon:"🥛", img:"https://media.prison.coffee.agency/items/potions/walnut_moonshine1.png" },
  { name:"Стакан Браги",                    type:"glass",     key:"braga",      effect:"Каждое третие использование скилла бьет случайным типом урона",                                                    icon:"🍺", img:"https://media.prison.coffee.agency/items/potions/raspberry_moonshine1.png" },
  { name:"Чекушка Вишнёвого Самогона",      type:"chekushka", key:"vishnya",    effect:"Увеличивает урон на 20%",                                                    icon:"🍒", img:"https://media.prison.coffee.agency/test455/items/potions/self_made_alcohol2.png" },
  { name:"Чекушка Яблочного Самогона",      type:"chekushka", key:"yabloko",    effect:"Увеличивает здоровье на 20%",                                                    icon:"🍏", img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine2.png" },
  { name:"Чекушка Медового Самогона",       type:"chekushka", key:"med",        effect:"Ускоряет восстановление энергии на 35%",                                                    icon:"🍯", img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine2.png" },
  { name:"Чекушка Омывайки",               type:"chekushka", key:"omyvajka",   effect:"Увеличивает броню на 25%",                                                    icon:"🧴", img:"https://media.prison.coffee.agency/test455/items/potions/potato_moonshine2.png" },
  { name:"Чекушка Облепихового Самогона",  type:"chekushka", key:"oblepiha",   effect:"Увеличивает криттический урон на 35%",                                                    icon:"🟠", img:"https://media.prison.coffee.agency/test455/items/potions/apple_moonshine2.png" },
  { name:"Чекушка Черничного Самогона",    type:"chekushka", key:"chernika",   effect:"Увеличивает уклонение на 25%",                                                    icon:"🫐", img:"https://media.prison.coffee.agency/test455/items/potions/rye_moonshine2.png" },
  { name:"Чекушка Воды из лужи",           type:"chekushka", key:"voda",       effect:"Увеличивает сопротивление яду на 15%",                                                    icon:"💧", img:"https://media.prison.coffee.agency/test455/items/potions/honey_moonshine2.png" },
  { name:"Чекушка Смородинового Самогона", type:"chekushka", key:"smorodina",  effect:"Увеличивает сопротивление кровотечению на 15%",                                                    icon:"🍇", img:"https://media.prison.coffee.agency/test455/items/potions/currant_moonshine2.png" },
  { name:"Бутыль Вишнёвого Самогона",       type:"bottle",    key:"vishnya",    effect:"Увеличивает урон на 30%",                               icon:"🍒", img:"https://media.prison.coffee.agency/test455/items/potions/self_made_alcohol3.png" },
  { name:"Бутыль Яблочного Самогона",       type:"bottle",    key:"yabloko",    effect:"Увеличивает здоровье на 30%",                                                    icon:"🍏", img:"https://media.prison.coffee.agency/test455/items/potions/cherry_moonshine3.png" },
  { name:"Бутыль Медового Самогона",        type:"bottle",    key:"med",        effect:"Ускоряет восстановление энергии на 50%",               icon:"🍯", img:"https://media.prison.coffee.agency/test455/items/potions/buckwheat_moonshine3.png" },
  { name:"Бутыль Омывайки",                type:"bottle",    key:"omyvajka",   effect:"Увлеичивает броню на 40%",                                                    icon:"🧴", img:"https://media.prison.coffee.agency/test455/items/potions/potato_moonshine3.png" },
  { name:"Бутыль Облепихового Самогона",   type:"bottle",    key:"oblepiha",   effect:"Увеличивает критический урон на 50%",                                                    icon:"🟠", img:"https://media.prison.coffee.agency/test455/items/potions/apple_moonshine3.png" },
  { name:"Бутыль Черничного Самогона",     type:"bottle",    key:"chernika",   effect:"Увеличивает базовое уклонение на 40%",                 icon:"🫐", img:"https://media.prison.coffee.agency/test455/items/potions/rye_moonshine3.png" },
  { name:"Бутыль Воды из лужи",            type:"bottle",    key:"voda",       effect:"Увеличивает сопротивление яду на 20%",                 icon:"💧", img:"https://media.prison.coffee.agency/test455/items/potions/honey_moonshine3.png" },
  { name:"Бутыль Смородинового Самогона",  type:"bottle",    key:"smorodina",  effect:"Увеличивает сопротивление кровотечению на 20%",        icon:"🍇", img:"https://media.prison.coffee.agency/test455/items/potions/currant_moonshine3.png" },
  { name:"Бутыль Антисептика",             type:"bottle",    key:"antiseptik", effect:"Восстанавливает 4% здоровья за ход",                                                    icon:"🟢", img:"https://media.prison.coffee.agency/test455/items/potions/sea_buckthorn_moonshine3.png" },
  { name:"Бутыль Лавандового Самогона",    type:"bottle",    key:"lavanda",    effect:"Неуязвимость на 3 хода после смерти",                  icon:"💜", img:"https://media.prison.coffee.agency/test455/items/potions/rose_hip_moonshine3.png" },
  { name:"Бутыль Берёзового Самогона",     type:"bottle",    key:"bereza",     effect:"Атаки наносят 45% урона по области",                   icon:"🌿", img:"https://media.prison.coffee.agency/test455/items/potions/viburnum_moonshine3.png" },
  { name:"Бутыль Рисового Самогона",       type:"bottle",    key:"ris",        effect:"Ускоряет восстановление боссов на 30%",                icon:"🍚", img:"https://media.prison.coffee.agency/test455/items/potions/birch_moonshine3.png" },
  { name:"Бутыль Кумыса",                  type:"bottle",    key:"kumys",      effect:"При промахе +30 урона за стак (макс. 20 стаков)",      icon:"🥛", img:"https://media.prison.coffee.agency/test455/items/potions/walnut_moonshine3.png" },
  { name:"Бутыль Черноплодного Самогона",  type:"bottle",    key:"chernoplod", effect:"Блокирует следующие 3 негативных эффекта",             icon:"⚫", img:"https://media.prison.coffee.agency/test455/items/potions/rowan_moonshine3.png" },
];

const RAR_LABEL  = { uncommon:"Uncommon", rare:"Rare", epic:"Epic", legendary:"Legendary" };
const RAR_COLOR  = { uncommon:"var(--ok)", rare:"var(--blue2)", epic:"var(--purple)", legendary:"var(--amber)" };
const CAT_LABEL  = { glass:"Стаканы", chekushka:"Чекушки", bottle:"Бутыли", chip:"Фишки", mark:"Метки" };
const CAT_ICON   = { glass:"🥃", chekushka:"🍶", bottle:"🍾", chip:"🎴", mark:"📌" };
const TYPE_LABEL = { glass:"Стакан", chekushka:"Чекушка", bottle:"Бутыль" };

const IC = {
  sigs:  '<img class="cur-ico" src="https://media.prison.coffee.agency/items/valute/cigarettes.webp" />',
  kop:   '<img class="cur-ico" src="https://media.prison.coffee.agency/test455/items/hustler/monetkaBronz1.png" />',
  silv:  '<img class="cur-ico" src="https://media.prison.coffee.agency/test455/items/hustler/monetkaSilver1.png" />',
  chirk: '<img class="cur-ico" src="https://media.prison.coffee.agency/test455/items/hustler/monetkaGold1.png" />',
};

function fmtNum(n) { return n > 0 ? n.toLocaleString("ru-RU") : "—"; }

function costBadges(l, small) {
  const sz = small ? " small" : "";
  return [
    l.sigs  ? `<span class="bary-cost sigs${sz}">${IC.sigs} ${fmtNum(l.sigs)}</span>`   : "",
    l.kop   ? `<span class="bary-cost kop${sz}">${IC.kop} ${fmtNum(l.kop)}</span>`     : "",
    l.silv  ? `<span class="bary-cost silv${sz}">${IC.silv} ${fmtNum(l.silv)}</span>`  : "",
    l.chirk ? `<span class="bary-cost chirk${sz}">${IC.chirk} ${fmtNum(l.chirk)}</span>` : "",
  ].join("");
}

export async function renderBarygа() {
  const root = document.createElement("div");
  root.className = "barygа-page";
  const state = { tab:"levels", shopCat:"", shopLv:0, shopSearch:"", effView:"list" };

  root.innerHTML = `
    <div class="card">
      <div class="row">
        <div>
          <div class="card-title">🏪 БАРЫГА</div>
          <div class="card-sub">Прокачка · Магазин · Расходники</div>
        </div>
        <span class="badge amber">35 уровней</span>
      </div>
    </div>
    <div class="card no-accent" style="padding:10px 14px;">
      <div class="bary-tabs">
        <button class="bary-tab active" data-btab="levels"  type="button">📈 Прокачка</button>
        <button class="bary-tab"        data-btab="shop"    type="button">🛒 Магазин</button>
        <button class="bary-tab"        data-btab="effects" type="button">⚗️ Расходники</button>
      </div>
    </div>
    <div id="baryContent"></div>
  `;

  root.querySelectorAll(".bary-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.btab;
      root.querySelectorAll(".bary-tab").forEach(b => b.classList.toggle("active", b.dataset.btab === state.tab));
      renderContent();
    });
  });

  function renderContent() {
    const wrap = root.querySelector("#baryContent");
    if (state.tab === "levels")  renderLevels(wrap);
    if (state.tab === "shop")    renderShop(wrap);
    if (state.tab === "effects") renderEffects(wrap);
  }


  function renderLevels(wrap) {
    const tot = { sigs:0, kop:0, silv:0, chirk:0 };
    LEVELS.forEach(l => { tot.sigs+=l.sigs||0; tot.kop+=l.kop||0; tot.silv+=l.silv||0; tot.chirk+=l.chirk||0; });

    wrap.innerHTML = `
      <div class="card no-accent" style="padding:14px 16px;">
        <div class="section-title" style="margin-bottom:10px;">🧮 КАЛЬКУЛЯТОР</div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="muted" style="font-size:12px;">Текущий уровень</span>
            <input class="input" id="lvFrom" type="number" min="0" max="34" value="0" style="width:54px;text-align:center;" />
          </div>
          <span style="color:var(--amber);font-weight:700;">→</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="muted" style="font-size:12px;">Целевой уровень</span>
            <input class="input" id="lvTo" type="number" min="1" max="35" value="35" style="width:54px;text-align:center;" />
          </div>
        </div>
        <div id="calcResult" style="margin-top:12px;"></div>
      </div>

      <div class="card no-accent" style="padding:12px 16px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-ghost);margin-bottom:8px;">ИТОГО НА ВСЕ 35 УРОВНЕЙ</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">${costBadges(tot)}</div>
      </div>

      <div class="card" style="padding:0;overflow:hidden;">
        <div class="bary-lv-head">
          <div class="bary-lv-num">#</div>
          <div class="bary-lv-costs">Стоимость прокачки</div>
          <div class="bary-lv-reward">Требуемый предмет</div>
        </div>
        <div>${LEVELS.map(l => {
          const rc = l.rar ? RAR_COLOR[l.rar] : "transparent";
          const rl = l.rar ? RAR_LABEL[l.rar]  : "";
          const ft = LV_FIRST[l.lv] ? `<span class="bary-first-tag">${LV_FIRST[l.lv]}</span>` : "";
          return `
            <div class="bary-lv-row ${l.item ? "has-reward" : ""}">
              <div class="bary-lv-num">${l.lv}</div>
              <div class="bary-lv-costs">${costBadges(l)}</div>
              <div class="bary-lv-reward">
                ${l.item
                  ? `<span class="bary-item-name">${esc(l.item)}</span>
                     <span class="badge" style="background:${rc}22;color:${rc};border-color:${rc}44;font-size:10px;">${rl}</span>`
                  : `<span class="muted" style="font-size:12px;">—</span>`}
                ${ft}
              </div>
            </div>`;
        }).join("")}</div>
      </div>

      <div class="card no-accent" style="padding:12px 16px;">
        <div class="muted" style="font-size:12px;line-height:1.9;">
          ${IC.kop} <b>Копейки</b> — основная валюта прокачки<br>
          ${IC.silv} <b>Серебро</b> — появляются с уровня 5<br>
          ${IC.chirk} <b>Чирки</b> — появляются с уровня 9<br>
          ${IC.sigs} <b>Сигареты</b> — требуются вместе с предметом
        </div>
      </div>
    `;

    function updateCalc() {
      const from = Math.max(0, Math.min(34, parseInt(wrap.querySelector("#lvFrom").value)||0));
      const to   = Math.max(1, Math.min(35, parseInt(wrap.querySelector("#lvTo").value)||35));
      const el   = wrap.querySelector("#calcResult");
      if (from >= to) {
        el.innerHTML = `<div class="muted" style="font-size:12px;">Целевой уровень должен быть больше текущего</div>`;
        return;
      }
      const slice = LEVELS.filter(l => l.lv > from && l.lv <= to);
      const s = {sigs:0,kop:0,silv:0,chirk:0};
      slice.forEach(l => { s.sigs+=l.sigs||0; s.kop+=l.kop||0; s.silv+=l.silv||0; s.chirk+=l.chirk||0; });
      const items = slice.filter(l=>l.item).map(l=>
        `<div style="font-size:12px;padding:2px 0;">• ${esc(l.item)}</div>`
      );
      el.innerHTML = `
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-ghost);margin-bottom:8px;">
          НУЖНО ДЛЯ УРОВНЕЙ ${from+1}–${to}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">${costBadges(s)}</div>
        ${items.length ? `
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-ghost);margin:10px 0 6px;">
            ПРЕДМЕТЫ (${items.length} шт.)
          </div>
          <div style="color:var(--text-dim);">${items.join("")}</div>` : ""}
      `;
    }
    wrap.querySelector("#lvFrom").addEventListener("input", updateCalc);
    wrap.querySelector("#lvTo").addEventListener("input", updateCalc);
    updateCalc();
  }

  function renderShop(wrap) {
    const cats = ["","glass","chekushka","bottle","chip","mark"];
    wrap.innerHTML = `
      <div class="card no-accent" style="padding:12px 14px;">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;" id="shopCatBar">
          ${cats.map(c=>`
            <button class="rcp-chip ${c===state.shopCat?"active":""}" data-sc="${c}" type="button">
              ${c ? CAT_ICON[c]+" "+CAT_LABEL[c] : "Все"}
            </button>`).join("")}
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          <div class="search-wrap" style="flex:1;min-width:160px;">
            <span class="search-icon">🔍</span>
            <input class="input" id="shopSearch" placeholder="Поиск предмета..."
              style="padding-left:36px;" value="${esc(state.shopSearch)}" />
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <span class="muted" style="font-size:12px;">Уровень барыги:</span>
            <input class="input" id="shopLvInput" type="number" min="0" max="35"
              value="${state.shopLv}" style="width:58px;text-align:center;" />
          </div>
        </div>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        <div class="bary-shop-head">
          <div class="bary-shop-lv">Лв</div>
          <div class="bary-shop-name">Предмет</div>
          <div class="bary-shop-price">Цена</div>
          <div class="bary-shop-qty">Лимит/сут.</div>
        </div>
        <div id="shopBody"></div>
      </div>
    `;

    wrap.querySelector("#shopCatBar").addEventListener("click", e => {
      const btn = e.target.closest("[data-sc]");
      if (!btn) return;
      state.shopCat = btn.dataset.sc;
      wrap.querySelectorAll("[data-sc]").forEach(b => b.classList.toggle("active", b.dataset.sc===state.shopCat));
      updateShop();
    });

    const searchEl = wrap.querySelector("#shopSearch");
    searchEl.addEventListener("input", () => {
      clearTimeout(searchEl._t);
      searchEl._t = setTimeout(()=>{ state.shopSearch=searchEl.value.toLowerCase().trim(); updateShop(); }, 150);
    });

    wrap.querySelector("#shopLvInput").addEventListener("input", e => {
      state.shopLv = Math.max(0, Math.min(35, parseInt(e.target.value)||0));
      updateShop();
    });

    function updateShop() {
      const list = SHOP_ITEMS.filter(i => {
        if (state.shopCat   && i.cat !== state.shopCat)                            return false;
        if (state.shopLv    && i.lv  > state.shopLv)                              return false;
        if (state.shopSearch && !i.name.toLowerCase().includes(state.shopSearch))  return false;
        return true;
      });
      const body = wrap.querySelector("#shopBody");
      if (!list.length) {
        body.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Ничего не найдено</div></div>`;
        return;
      }
      body.innerHTML = list.map(i=>`
        <div class="bary-shop-row">
          <div class="bary-shop-lv"><span class="badge" style="font-size:11px;">${i.lv}</span></div>
          <div class="bary-shop-name">
            ${i.img
              ? `<img class="bary-item-img" src="${i.img}" alt="${esc(i.name)}" />`
              : `<span style="font-size:18px;">${CAT_ICON[i.cat]}</span>`}
            <span style="font-weight:600;font-size:13px;">${esc(i.name)}</span>
          </div>
          <div class="bary-shop-price">
            ${i.kop   ? `<span class="bary-cost kop small">${IC.kop}${i.kop}</span>`      : ""}
            ${i.silv  ? `<span class="bary-cost silv small">${IC.silv}${i.silv}</span>`   : ""}
            ${i.chirk ? `<span class="bary-cost chirk small">${IC.chirk}${i.chirk}</span>` : ""}
          </div>
          <div class="bary-shop-qty"><span class="badge">${i.qty>1?"×"+i.qty:"×1"}</span></div>
        </div>`).join("");
    }
    updateShop();
  }

  function renderEffects(wrap) {

    function listView() {
      return [
        { title:"🥃 СТАКАНЫ",  type:"glass"     },
        { title:"🍶 ЧЕКУШКИ",  type:"chekushka" },
        { title:"🍾 БУТЫЛИ",   type:"bottle"    },
      ].map(g => {
        const items = CONSUMABLES.filter(c => c.type === g.type);
        return `
          <div class="section-title">${g.title}</div>
          <div class="card" style="padding:0;overflow:hidden;">
            ${items.map(c => {
              const unk = c.effect === "?";
              return `
                <div class="bary-eff-row">
                  ${c.img
                    ? `<img class="bary-item-img lg" src="${c.img}" alt="${esc(c.name)}" />`
                    : `<span style="font-size:26px;flex-shrink:0;">${c.icon}</span>`}
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:13px;">${esc(c.name)}</div>
                    <div style="font-size:13px;margin-top:3px;color:${unk?"var(--text-ghost)":"var(--text-dim)"};">
                      ${unk ? "Эффект неизвестен" : esc(c.effect)}
                    </div>
                  </div>
                  ${unk ? '<span class="badge" style="opacity:0.4;flex-shrink:0;">?</span>' : ""}
                </div>`;
            }).join("")}
          </div>`;
      }).join("") + `<div class="card no-accent" style="padding:12px 16px;">
        <div class="muted" style="font-size:12px;">⚠️ Возможны опечатки/изменения:)</div>
      </div>`;
    }

    function compareView() {
      const keys = [...new Set(CONSUMABLES.map(c=>c.key))];
      const types = ["glass","chekushka","bottle"];
      return `
        <div class="card" style="padding:0;overflow:hidden;">
          <div class="bary-cmp-head">
            <div class="bary-cmp-icon"></div>
            <div class="bary-cmp-cell">🥃 Стакан</div>
            <div class="bary-cmp-cell">🍶 Чекушка</div>
            <div class="bary-cmp-cell">🍾 Бутыль</div>
          </div>
          ${keys.map(key => {
            const byType = {};
            types.forEach(t => { byType[t] = CONSUMABLES.find(c=>c.key===key&&c.type===t); });
            const base = byType.glass || byType.bottle;
            if (!base) return "";
            return `
              <div class="bary-cmp-row">
                <div class="bary-cmp-icon">
                  ${base.img
                    ? `<img class="bary-item-img lg" src="${base.img}" />`
                    : `<span style="font-size:22px;">${base.icon}</span>`}
                </div>
                ${types.map(t => {
                  const c = byType[t];
                  if (!c) return `<div class="bary-cmp-cell bary-cmp-empty">—</div>`;
                  const unk = c.effect==="?";
                  return `
                    <div class="bary-cmp-cell">
                      <div class="bary-cmp-type">${TYPE_LABEL[t]}</div>
                      <div class="bary-cmp-effect${unk?" unknown":""}">${unk?"?":esc(c.effect)}</div>
                    </div>`;
                }).join("")}
              </div>`;
          }).join("")}
        </div>
        <div class="card no-accent" style="padding:12px 16px;">
          <div class="muted" style="font-size:12px;">
            💡 Возможны опечатки. <b>?</b> — Изминения:)
          </div>
        </div>`;
    }

    wrap.innerHTML = `
      <div class="card no-accent" style="padding:10px 14px;">
        <div style="display:flex;gap:6px;">
          <button class="bary-tab ${state.effView==="list"?"active":""}"    id="effList" type="button">📋 По типу</button>
          <button class="bary-tab ${state.effView==="compare"?"active":""}" id="effCmp"  type="button">⚖️ Сравнение</button>
        </div>
      </div>
      <div id="effBody"></div>
    `;

    const refreshEff = () => {
      wrap.querySelector("#effBody").innerHTML =
        state.effView === "list" ? listView() : compareView();
    };

    wrap.querySelector("#effList").addEventListener("click", () => {
      state.effView = "list";
      wrap.querySelector("#effList").classList.add("active");
      wrap.querySelector("#effCmp").classList.remove("active");
      refreshEff();
    });
    wrap.querySelector("#effCmp").addEventListener("click", () => {
      state.effView = "compare";
      wrap.querySelector("#effCmp").classList.add("active");
      wrap.querySelector("#effList").classList.remove("active");
      refreshEff();
    });

    refreshEff();
  }

  renderContent();
  return root;
}
