import { esc } from "../utils.js";

const STATUS_EFFECTS = [
  {
    id: "potion_bonus_damage",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0411\u043e\u043d\u0443\u0441 \u0443\u0440\u043e\u043d\u0430",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043d\u0430\u043d\u043e\u0441\u0438\u043c\u044b\u0439 \u0443\u0440\u043e\u043d",
    type: "positive",
    icon: "Sword1Red",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_health",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0417\u0434\u043e\u0440\u043e\u0432\u044c\u0435",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u0435 \u0432 \u0431\u043e\u044e",
    type: "positive",
    icon: "HealthGreen",
    imgUrl: "https://media.prison.coffee.agency/effects/HEALTH.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус здоровья", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_energy_regeneration",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0420\u0435\u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f \u044d\u043d\u0435\u0440\u0433\u0438\u0438",
    desc: "\u0412\u043e\u0441\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u0442 \u044d\u043d\u0435\u0440\u0433\u0438\u044e \u043a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434",
    type: "positive",
    icon: "Stamina",
    imgUrl: "https://media.prison.coffee.agency/effects/ENERGY_REGENERATION.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Энергия за ход", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_armor",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0411\u0440\u043e\u043d\u044f",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e",
    type: "positive",
    icon: "Armor",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус брони", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_crit_damage",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u041a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d",
    type: "positive",
    icon: "SkullRed",
    imgUrl: "https://media.prison.coffee.agency/effects/CRIT_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус крит урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_evasion",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0423\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u0435",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0448\u0430\u043d\u0441 \u0443\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044f",
    type: "positive",
    icon: "EvasionBuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус уклонения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_poison_immunity",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0418\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u044f\u0434\u0443",
    desc: "\u0414\u0430\u0435\u0442 \u0438\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u044f\u0434\u0443",
    type: "positive",
    icon: "ResistPoison",
    imgUrl: "https://media.prison.coffee.agency/effects/POISON_IMMUNITY.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_blood_immunity",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0418\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u043a\u0440\u043e\u0432\u043e\u0442\u0435\u0447\u0435\u043d\u0438\u044e",
    desc: "\u0414\u0430\u0435\u0442 \u0438\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u043a\u0440\u043e\u0432\u043e\u0442\u0435\u0447\u0435\u043d\u0438\u044e",
    type: "positive",
    icon: "ResistBleeding",
    imgUrl: "https://media.prison.coffee.agency/effects/BLOOD_IMMUNITY.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_healing",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0423\u0441\u0438\u043b\u0435\u043d\u0438\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f",
    desc: "\u0423\u0441\u0438\u043b\u0438\u0432\u0430\u0435\u0442 \u0432\u0441\u0435 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u043e\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u0435",
    type: "positive",
    icon: "Regeneration",
    imgUrl: "https://media.prison.coffee.agency/effects/REGENERATION.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус лечения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_second_breath",
    name: "\u0412\u0442\u043e\u0440\u043e\u0435 \u0434\u044b\u0445\u0430\u043d\u0438\u0435",
    desc: "\u041f\u0440\u0438 \u0441\u043c\u0435\u0440\u0442\u0438 \u0432\u043e\u0441\u043a\u0440\u0435\u0448\u0430\u0435\u0442 \u0441 1 HP \u0438 \u0434\u0430\u0435\u0442 \u043d\u0435\u0443\u044f\u0437\u0432\u0438\u043c\u043e\u0441\u0442\u044c \u043d\u0430 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0445\u043e\u0434\u043e\u0432. \u0421\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u0435\u0442 \u043e\u0434\u0438\u043d \u0440\u0430\u0437.",
    type: "positive",
    icon: "WillToLife",
    imgUrl: "https://media.prison.coffee.agency/effects/SECOND_BREATH.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "invulnerabilityDuration", "name": "Длительность неуязвимости", "format": "absolute"}],
  },
  {
    id: "potion_block_negative_effect",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0411\u043b\u043e\u043a \u043d\u0435\u0433\u0430\u0442\u0438\u0432\u043d\u044b\u0445 \u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432",
    desc: "\u0411\u043b\u043e\u043a\u0438\u0440\u0443\u0435\u0442 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u043d\u0435\u0433\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u044d\u0444\u0444\u0435\u043a\u0442\u044b",
    type: "positive",
    icon: "BlockNegativeEffect",
    imgUrl: "https://media.prison.coffee.agency/effects/BLOCK_NEGATIVE_EFFECT.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "stacks", "name": "Блоков осталось", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_aoe",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0423\u0441\u0438\u043b\u0435\u043d\u0438\u0435 \u0410\u041e\u0415",
    desc: "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u0430\u0442\u0430\u043a\u0438 \u043f\u043e \u043e\u0434\u043d\u043e\u0439 \u0446\u0435\u043b\u0438 \u043d\u0430\u043d\u043e\u0441\u044f\u0442 \u0443\u0440\u043e\u043d \u0432\u0441\u0435\u043c \u0432\u0440\u0430\u0433\u0430\u043c",
    type: "positive",
    icon: "AOE",
    imgUrl: "https://media.prison.coffee.agency/effects/AOE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Урон по области", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_cooldown",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0421\u043d\u0438\u0436\u0435\u043d\u0438\u0435 \u043f\u0435\u0440\u0435\u0437\u0430\u0440\u044f\u0434\u043a\u0438",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0432\u0440\u0435\u043c\u044f \u043f\u0435\u0440\u0435\u0437\u0430\u0440\u044f\u0434\u043a\u0438 \u043d\u0430\u0432\u044b\u043a\u043e\u0432",
    type: "positive",
    icon: "Cooldown",
    imgUrl: "https://media.prison.coffee.agency/effects/COOLDOWN.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Снижение перезарядки", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_miss_hit_boost",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0423\u0441\u0438\u043b\u0435\u043d\u0438\u0435 \u043f\u0440\u0438 \u043f\u0440\u043e\u043c\u0430\u0445\u0435",
    desc: "\u041f\u0440\u0438 \u043f\u0440\u043e\u043c\u0430\u0445\u0435 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0430\u0442\u0430\u043a\u0430 \u043d\u0430\u043d\u043e\u0441\u0438\u0442 \u0431\u043e\u043b\u044c\u0448\u0435 \u0443\u0440\u043e\u043d\u0430",
    type: "positive",
    icon: "MissHitBoost",
    imgUrl: "https://media.prison.coffee.agency/effects/MISS_HIT_BOOST.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Бонус урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_change_damage_type",
    name: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d: \u0421\u043c\u0435\u043d\u0430 \u0442\u0438\u043f\u0430 \u0443\u0440\u043e\u043d\u0430",
    desc: "\u041a\u0430\u0436\u0434\u043e\u0435 3-\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043d\u0430\u0432\u044b\u043a\u0430 \u043d\u0430\u043d\u043e\u0441\u0438\u0442 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0439 \u0442\u0438\u043f \u0443\u0440\u043e\u043d\u0430",
    type: "positive",
    icon: "ChangeDamageType",
    imgUrl: "https://media.prison.coffee.agency/effects/CHANGE_DAMAGE_TYPE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "counter", "name": "Использований до смены", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "skill_tree_armor10_turn",
    name: "\u0417\u0430\u0449\u0438\u0442\u043d\u0430\u044f \u0441\u0442\u043e\u0439\u043a\u0430",
    desc: "\u0414\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e",
    type: "positive",
    icon: "Armor2",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Броня", "format": "absolute"}],
  },
  {
    id: "iron_shield",
    name: "\u0416\u0435\u043b\u0435\u0437\u043d\u044b\u0439 \u043f\u0430\u043d\u0446\u0438\u0440\u044c",
    desc: "\u0421\u043e\u0437\u0434\u0430\u0435\u0442 \u043f\u0440\u043e\u0447\u043d\u044b\u0439 \u0449\u0438\u0442, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u043c\u043e\u0436\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043d\u044b\u0439 \u0443\u0440\u043e\u043d \u0437\u0430 \u0443\u0434\u0430\u0440. \u0420\u0430\u0437\u0440\u0443\u0448\u0430\u0435\u0442\u0441\u044f, \u043a\u043e\u0433\u0434\u0430 \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043f\u0430\u0434\u0430\u0435\u0442 \u0434\u043e 0",
    type: "positive",
    icon: "Armor2",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "currentHealth", "name": "Текущая прочность", "format": "absolute"}, {"key": "maxHealth", "name": "Прочность", "format": "absolute"}, {"key": "maxDamagePerHit", "name": "Максимальный урон за удар", "format": "absolute"}],
  },
  {
    id: "rage",
    name: "\u042f\u0440\u043e\u0441\u0442\u044c",
    desc: "\u0421 \u043a\u0430\u0436\u0434\u044b\u043c \u0445\u043e\u0434\u043e\u043c \u044f\u0440\u043e\u0441\u0442\u044c \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0431\u0430\u0437\u043e\u0432\u044b\u0439 \u0443\u0440\u043e\u043d",
    type: "positive",
    icon: "Sword1Red",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Урон увеличен", "format": "percent"}, {"key": "increase", "name": "Увеличение урона за ход", "format": "absolute"}],
  },
  {
    id: "toxins",
    name: "\u0422\u043e\u043a\u0441\u0438\u043d\u044b",
    desc: "\u041d\u0430\u043a\u043b\u0430\u0434\u044b\u0432\u0430\u0435\u0442 \u043d\u0430 \u0432\u0440\u0430\u0433\u0430 \u0442\u043e\u043a\u0441\u0438\u043d\u044b, \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u044e\u0449\u0438\u0435 \u043b\u044e\u0431\u043e\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u0435",
    type: "negative",
    icon: "RegenerationDebuff",
    imgUrl: "https://media.prison.coffee.agency/effects/REGENERATION.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}, {"key": "value", "name": "Снижение лечения", "format": "percent"}],
  },
  {
    id: "doom",
    name: "\u041f\u0440\u0438\u0433\u043e\u0432\u043e\u0440",
    desc: "\u041f\u0440\u043e\u043a\u043b\u044f\u043d\u0430\u0435\u0442 \u0432\u0440\u0430\u0433\u0430, \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u044f \u043b\u044e\u0431\u043e\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u0435 \u043d\u0430 100%. \u0420\u0430\u0437\u0432\u0435\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0443\u0431\u0438\u0439\u0441\u0442\u0432\u043e\u043c \u0432\u0440\u0430\u0433\u0430",
    type: "negative",
    icon: "Doom",
    imgUrl: "",
    emoji: "\ud83d\udc80",
    src: "",
    srcLink: "",
    params: [],
  },
  {
    id: "ignore_armor",
    name: "\u041f\u0440\u043e\u0431\u0438\u0432\u043d\u043e\u0439",
    desc: "\u041f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e \u0438\u0433\u043d\u043e\u0440\u0438\u0440\u0443\u0435\u0442 \u0431\u0440\u043e\u043d\u044e \u0446\u0435\u043b\u0438",
    type: "positive",
    icon: "ArmorIgnore",
    imgUrl: "",
    emoji: "\ud83d\udd29",
    src: "",
    srcLink: "",
    params: [],
  },
  {
    id: "steal_money",
    name: "\u0412\u043e\u0440",
    desc: "\u041a\u0440\u0430\u0434\u0435\u0442 \u0441\u0438\u0433\u0430\u0440\u0435\u0442\u044b \u0443 \u0446\u0435\u043b\u0438 \u0441 \u043a\u0430\u0436\u0434\u044b\u043c \u0443\u0434\u0430\u0440\u043e\u043c",
    type: "positive",
    icon: "Coin",
    imgUrl: "https://media.prison.coffee.agency/effects/MINERAL_WATER.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Ворует сигарет", "format": "absolute"}],
  },
  {
    id: "death_strike",
    name: "\u0421\u043c\u0435\u0440\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u0443\u0434\u0430\u0440",
    desc: "\u0423\u043c\u0438\u0440\u0430\u0435\u0442 \u0447\u0435\u0440\u0435\u0437 \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0445\u043e\u0434\u043e\u0432",
    type: "negative",
    icon: "SkullBlack",
    imgUrl: "",
    emoji: "\u2620\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "turnsLeft", "name": "Ходов осталось", "format": "absolute"}],
  },
  {
    id: "lucky_strike",
    name: "\u0423\u0434\u0430\u0447\u043d\u044b\u0439 \u0443\u0434\u0430\u0440",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0448\u0430\u043d\u0441 \u043f\u043e\u043f\u0430\u0434\u0430\u043d\u0438\u044f \u0434\u043e 100%",
    type: "positive",
    icon: "LuckyStrike",
    imgUrl: "",
    emoji: "\ud83c\udf40",
    src: "",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "boss_authority",
    name: "\u0410\u0432\u0442\u043e\u0440\u0438\u0442\u0435\u0442 \u0431\u043e\u0441\u0441\u0430",
    desc: "\u041a\u0430\u0436\u0434\u044b\u0439 \u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0434\u0430\u0440 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0438\u0433\u043d\u043e\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0440\u043e\u0446\u0435\u043d\u0442\u043d\u043e\u0439 \u0431\u0440\u043e\u043d\u0438 \u0432\u0440\u0430\u0433\u043e\u0432 \u043d\u0430 1% \u0434\u043e \u043a\u043e\u043d\u0446\u0430 \u0431\u043e\u044f",
    type: "positive",
    icon: "ArmorIgnore",
    imgUrl: "",
    emoji: "\ud83d\udd29",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Игнорирование", "format": "absolute"}],
  },
  {
    id: "foma_vitality",
    name: "\u0411\u0430\u043d\u0434\u0438\u0442\u0441\u043a\u0430\u044f \u0436\u0438\u0432\u0443\u0447\u0435\u0441\u0442\u044c",
    desc: "\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0430\u0435\u0442 \u0441 \u043f\u043e\u0442\u0435\u0440\u0435\u0439 \u0432\u0441\u0435\u0445 \u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432 \u0438 \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435\u043c 15% \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f. \u041f\u0435\u0440\u0435\u0437\u0430\u0440\u044f\u0434\u043a\u0430 10 \u0445\u043e\u0434\u043e\u0432",
    type: "negative",
    icon: "WillToLifeBad",
    imgUrl: "https://media.prison.coffee.agency/effects/SECOND_BREATH.png",
    emoji: "\u2694\ufe0f",
    src: "\u0424\u043e\u043c\u0430",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Перезарядка", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Перезарядка", "format": "absolute"}],
  },
  {
    id: "foma_immunity",
    name: "\u0417\u0430\u043a\u0430\u043b\u043a\u0430",
    desc: "\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u0438\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u0442\u0438\u043f\u0430\u043c \u0443\u0440\u043e\u043d\u0430 \u0438 \u043d\u0435\u0433\u0430\u0442\u0438\u0432\u043d\u044b\u043c \u044d\u0444\u0444\u0435\u043a\u0442\u0430\u043c",
    type: "positive",
    icon: "DeathHood",
    imgUrl: "",
    emoji: "\u26b0\ufe0f",
    src: "\u0424\u043e\u043c\u0430",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}, {"key": "damagePiercing", "name": "Иммунитет к колющему", "format": "absolute"}, {"key": "damageSlashing", "name": "Иммунитет к режущему", "format": "absolute"}, {"key": "damageBludgeoning", "name": "Иммунитет к дробящему", "format": "absolute"}, {"key": "statusBleeding", "name": "Иммунитет к кровотечению", "format": "absolute"}, {"key": "statusPoison", "name": "Иммунитет к яду", "format": "absolute"}, {"key": "statusShock", "name": "Иммунитет к шоку", "format": "absolute"}, {"key": "statusBurn", "name": "Иммунитет к поджогу", "format": "absolute"}],
  },
  {
    id: "slay_vito_curse_attack",
    name: "\u041f\u0440\u043e\u043a\u043b\u044f\u0442\u044c\u0435 \u0421\u043a\u0435\u043b\u0435\u0442\u0442\u043e: \u0410\u0442\u0430\u043a\u0430",
    desc: "\u0412\u044b \u043f\u0440\u043e\u043a\u043b\u044f\u0442\u044b. \u0420\u0430\u0437\u044b\u0433\u0440\u044b\u0432\u0430\u044f \u0430\u0442\u0430\u043a\u0443, \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 6 \u0443\u0440\u043e\u043d\u0430",
    type: "negative",
    icon: "Sword1Red",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}, {"key": "value", "name": "Урон", "format": "absolute"}],
  },
  {
    id: "slay_vito_curse_skill",
    name: "\u041f\u0440\u043e\u043a\u043b\u044f\u0442\u044c\u0435 \u0421\u043a\u0435\u043b\u0435\u0442\u0442\u043e: \u041d\u0430\u0432\u044b\u043a",
    desc: "\u0412\u044b \u043f\u0440\u043e\u043a\u043b\u044f\u0442\u044b. \u0420\u0430\u0437\u044b\u0433\u0440\u044b\u0432\u0430\u044f \u043d\u0430\u0432\u044b\u043a, \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 5 \u0443\u0440\u043e\u043d\u0430",
    type: "negative",
    icon: "Armor",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}, {"key": "value", "name": "Урон", "format": "absolute"}],
  },
  {
    id: "slay_vito_curse_talent",
    name: "\u041f\u0440\u043e\u043a\u043b\u044f\u0442\u044c\u0435 \u0421\u043a\u0435\u043b\u0435\u0442\u0442\u043e: \u0422\u0430\u043b\u0430\u043d\u0442",
    desc: "\u0412\u044b \u043f\u0440\u043e\u043a\u043b\u044f\u0442\u044b. \u0420\u0430\u0437\u044b\u0433\u0440\u044b\u0432\u0430\u044f \u0442\u0430\u043b\u0430\u043d\u0442, \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 10 \u0443\u0440\u043e\u043d\u0430",
    type: "negative",
    icon: "InspiredPurple",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}, {"key": "value", "name": "Урон", "format": "absolute"}],
  },
  {
    id: "vitos_glory",
    name: "\u0412\u0435\u043b\u0438\u0447\u0438\u0435 \u0421\u043a\u0435\u043b\u0435\u0442\u0442\u043e",
    desc: "\u0414\u0430\u0435\u0442 100 \u043d\u0435\u0441\u043e\u043a\u0440\u0443\u0448\u0438\u043c\u043e\u0439 \u0431\u0440\u043e\u043d\u0438 \u043d\u0430 3 \u0445\u043e\u0434\u0430",
    type: "positive",
    icon: "Armor",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}, {"key": "value", "name": "Брони", "format": "absolute"}],
  },
  {
    id: "invulnerability",
    name: "\u0412\u043e\u043b\u044f \u043a \u0436\u0438\u0437\u043d\u0438",
    desc: "\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u043d\u0435\u0443\u044f\u0437\u0432\u0438\u043c\u043e\u0441\u0442\u044c \u043a \u043b\u044e\u0431\u043e\u043c\u0443 \u0443\u0440\u043e\u043d\u0443",
    type: "positive",
    icon: "Invulnerability",
    imgUrl: "",
    emoji: "\ud83d\udee1\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "dipipi_burn",
    name: "\u041f\u043e\u0432\u044b\u0448\u0435\u043d\u043d\u043e\u0435 \u0434\u0430\u0432\u043b\u0435\u043d\u0438\u0435",
    desc: "\u041a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434 \u0442\u0435\u0440\u044f\u0435\u0442 3% \u043e\u0442 \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f",
    type: "negative",
    icon: "HealthDebuff",
    imgUrl: "",
    emoji: "\ud83d\udc94",
    src: "\u0414\u0438'\u041f\u0438\u043f\u0438",
    srcLink: "bosses",
    params: [{"key": "value", "name": "Снижение здоровья", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "dipipi_fire_stacks",
    name: "\u0420\u0430\u0441\u043a\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043c\u0435\u0442\u0430\u043b\u043b",
    desc: "\u041a\u0430\u0436\u0434\u044b\u0439 \u0443\u0434\u0430\u0440 \u043f\u043e\u0434\u0440\u044f\u0434 \u043f\u043e \u0446\u0435\u043b\u0438 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d \u043d\u0430 15%",
    type: "negative",
    icon: "HotMetal",
    imgUrl: "",
    emoji: "\ud83d\udd25",
    src: "\u0414\u0438'\u041f\u0438\u043f\u0438",
    srcLink: "bosses",
    params: [{"key": "value", "name": "Значение", "format": "absolute"}],
  },
  {
    id: "iceman_puck",
    name: "\u0428\u0430\u0439\u0431\u0430",
    desc: "\u0418\u0433\u0440\u043e\u043a \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u0443\u0434\u0432\u043e\u0435\u043d\u043d\u044b\u0439 \u0443\u0440\u043e\u043d \u043e\u0442 \u0428\u0430\u0439\u0431\u044b",
    type: "negative",
    icon: "Puck",
    imgUrl: "",
    emoji: "\ud83c\udfd2",
    src: "\u0428\u0430\u0439\u0431\u0430",
    srcLink: "bosses",
    params: [{"key": "damageMultiplier", "name": "Множитель урона", "format": "absolute"}],
  },
  {
    id: "precision_cut",
    name: "\u0422\u043e\u0447\u043d\u044b\u0439 \u0441\u0440\u0435\u0437",
    desc: "\u0421\u0440\u0435\u0437\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e \u0432\u0440\u0430\u0433\u0430 \u043d\u0430 50%",
    type: "negative",
    icon: "ArmorReduction1",
    imgUrl: "",
    emoji: "\u26a1",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Значение", "format": "absolute"}],
  },
  {
    id: "shock_confusion",
    name: "\u0428\u043e\u043a\u043e\u0432\u0430\u044f \u0442\u0435\u0440\u0430\u043f\u0438\u044f",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u043b\u0435\u0447\u0435\u043d\u0438\u0435 \u043d\u0430 50%",
    type: "negative",
    icon: "Shock",
    imgUrl: "",
    emoji: "\u26a1",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Снижение лечения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "shock",
    name: "\u0428\u043e\u043a",
    desc: "\u041d\u0430\u043a\u043b\u0430\u0434\u044b\u0432\u0430\u0435\u0442 \u0437\u0430\u0440\u044f\u0434\u044b \u0448\u043e\u043a\u0430 \u043d\u0430 \u0432\u0440\u0430\u0433\u0430. \u041a\u043e\u0433\u0434\u0430 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0437\u0430\u0440\u044f\u0434\u043e\u0432 \u043f\u0440\u0435\u0432\u044b\u0441\u0438\u0442 \u0432\u0440\u0430\u0436\u0435\u0441\u043a\u043e\u0435 \u0441\u043e\u043f\u0440\u043e\u0442\u0438\u0432\u043b\u0435\u043d\u0438\u0435 \u0448\u043e\u043a\u0443, \u0432\u0441\u0435 \u0432\u0440\u0430\u0433\u0438 \u043f\u043e\u043b\u0443\u0447\u0430\u0442 \u0443\u0440\u043e\u043d \u0432 \u0440\u0430\u0437\u043c\u0435\u0440\u0435 6% \u043e\u0442 \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f (\u0431\u043e\u0441\u0441\u044b) \u0438\u043b\u0438 10% (\u043c\u0438\u043d\u044c\u043e\u043d\u044b) \u0438 \u0443\u043c\u0435\u043d\u044c\u0448\u0435\u043d\u0438\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f \u043d\u0430 50%",
    type: "negative",
    icon: "Shock",
    imgUrl: "",
    emoji: "\u26a1",
    src: "",
    srcLink: "",
    params: [{"key": "stacks", "name": "Зарядов", "format": "absolute"}, {"key": "stacks", "name": "Зарядов", "format": "absolute"}, {"key": "resist", "name": "Сопротивление шоку", "format": "absolute"}],
  },
  {
    id: "burnout",
    name: "\u041f\u0435\u0440\u0435\u0433\u0440\u0435\u0432",
    desc: "\u0412\u0440\u0430\u0433 \u0433\u043e\u0440\u0438\u0442, \u0438\u0437-\u0437\u0430 \u0447\u0435\u0433\u043e \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u0443\u0440\u043e\u043d, \u0437\u0430\u0432\u0438\u0441\u044f\u0449\u0438\u0439 \u043e\u0442 \u0431\u0430\u0437\u043e\u0432\u043e\u0433\u043e \u043e\u0440\u0443\u0436\u0438\u044f. \u041a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434 \u043e\u0433\u043e\u043d\u044c \u0440\u0430\u0437\u0433\u043e\u0440\u0430\u0435\u0442\u0441\u044f \u0438 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0432\u043e\u044e \u0441\u0438\u043b\u0443. \u0417\u0430 \u043a\u0430\u0436\u0434\u044b\u0439 \u0441\u0442\u0430\u043a \u0443\u0440\u043e\u043d \u043e\u0433\u043d\u044f \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043d\u0430 200% \u0438 \u0432\u0440\u0430\u0433 \u0442\u0435\u0440\u044f\u0435\u0442 10% \u0431\u0440\u043e\u043d\u0438. \u041c\u0430\u043a\u0441\u0438\u043c\u0443\u043c 5 \u0441\u0442\u0430\u043a\u043e\u0432. \u0415\u0441\u043b\u0438 \u0443\u0434\u0430\u0440\u0438\u0442\u044c \u043f\u043e \u0432\u0440\u0430\u0433\u0443 \u0438 \u043d\u0435 \u043f\u043e\u0434\u0436\u0435\u0447\u044c \u0435\u0433\u043e, \u043e\u0433\u043e\u043d\u044c \u043f\u043e\u0442\u0443\u0445\u043d\u0435\u0442",
    type: "negative",
    icon: "Burnout",
    imgUrl: "",
    emoji: "\ud83c\udf21\ufe0f",
    src: "\u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a",
    srcLink: "bosses",
    params: [{"key": "baseDamage", "name": "Базовый урон", "format": "absolute"}, {"key": "damage", "name": "Урон от огня", "format": "absolute"}, {"key": "armorReductionPercent", "name": "Снижение брони", "format": "percent"}, {"key": "damagePercent", "name": "Доля от базового урона", "format": "percent"}, {"key": "stacks", "name": "Стаков", "format": "absolute"}, {"key": "maxStacks", "name": "Максимальное количество стаков", "format": "absolute"}],
  },
  {
    id: "fighter_grab",
    name: "\u0411\u043e\u0439\u0446\u043e\u0432\u0441\u043a\u0438\u0439 \u0437\u0430\u0445\u0432\u0430\u0442",
    desc: "\u0426\u0435\u043b\u044c \u043f\u043e\u043f\u0430\u043b\u0430 \u0432 \u0437\u0430\u0445\u0432\u0430\u0442, \u043e\u0442 \u0447\u0435\u0433\u043e \u043e\u043d\u0430 \u0441\u0442\u0430\u043b\u0430 \u043c\u0435\u043d\u0435\u0435 \u0443\u0432\u043e\u0440\u043e\u0442\u043b\u0438\u0432\u043e\u0439. \u041d\u0430\u043a\u043b\u0430\u0434\u044b\u0432\u0430\u0435\u0442 \u044d\u0444\u0444\u0435\u043a\u0442 \u0431\u043e\u043b\u0438",
    type: "negative",
    icon: "EvasionDebuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "evasion_loss", "name": "Снижение уворотов", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "zahar_armor_crash",
    name: "\u0420\u0430\u0437\u0431\u0438\u043b \u043a\u043e\u043a\u043e\u0441",
    desc: "\u0417\u0430\u0445\u0430\u0440 \u0440\u0430\u0437\u0431\u0438\u0432\u0430\u0435\u0442 \u0432\u0430\u0448\u0443 \u0431\u0440\u043e\u043d\u044e \u043a\u0430\u043a \u043a\u043e\u043a\u043e\u0441, \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u044e \u0435\u0435 \u0434\u043e 0",
    type: "negative",
    icon: "ArmorReduction3",
    imgUrl: "",
    emoji: "\ud83d\udca5",
    src: "\u0417\u0430\u0445\u0430\u0440",
    srcLink: "bosses",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "warriors_block",
    name: "\u0420\u0435\u0430\u043a\u0446\u0438\u044f \u0431\u043e\u0439\u0446\u0430",
    desc: "\u0423\u0432\u043e\u0440\u043e\u0442 \u043e\u0442 \u043f\u0435\u0440\u0432\u044b\u0445 2 \u0443\u0434\u0430\u0440\u043e\u0432 \u0430\u0442\u0430\u043a\u0438",
    type: "positive",
    icon: "EvasionBuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Ударов осталось", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "purification",
    name: "\u041e\u0447\u0438\u0449\u0435\u043d\u0438\u0435",
    desc: "\u041a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434 \u0440\u0430\u0437\u0432\u0435\u0438\u0432\u0430\u0435\u0442 \u0432\u0441\u0435 \u0440\u0430\u0437\u0432\u0435\u0438\u0432\u0430\u0435\u043c\u044b\u0435 \u043e\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u044d\u0444\u0444\u0435\u043a\u0442\u044b",
    type: "positive",
    icon: "Purification",
    imgUrl: "",
    emoji: "\u2728",
    src: "",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "carbon_poison_immunity",
    name: "\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0443\u0433\u043e\u043b\u044c",
    desc: "\u0414\u0430\u0435\u0442 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0439 \u0438\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u044f\u0434\u0443",
    type: "positive",
    icon: "Coal",
    imgUrl: "https://media.prison.coffee.agency/effects/MINERAL_WATER.png",
    emoji: "\u2694\ufe0f",
    src: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a",
    srcLink: "baryga",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "analgin_damage_block",
    name: "\u0410\u043d\u0430\u043b\u044c\u0433\u0438\u043d",
    desc: "\u0411\u043b\u043e\u043a\u0438\u0440\u0443\u0435\u0442 10% \u0443\u0440\u043e\u043d\u0430",
    type: "positive",
    icon: "Analgin",
    imgUrl: "",
    emoji: "\ud83d\udc8a",
    src: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a",
    srcLink: "baryga",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "sedative_fear_immunity",
    name: "\u0423\u0441\u043f\u043e\u043a\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0435",
    desc: "\u0414\u0430\u0435\u0442 \u0438\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442 \u043a \u0441\u0442\u0440\u0430\u0445\u0443",
    type: "positive",
    icon: "Chill",
    imgUrl: "",
    emoji: "\ud83d\ude34",
    src: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a",
    srcLink: "baryga",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "potion_miss_boost",
    name: "\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u043d\u0430 \u043f\u0440\u043e\u043c\u0430\u0445\u0430\u0445",
    desc: "\u041a\u0430\u0436\u0434\u044b\u0439 \u043f\u0440\u043e\u043c\u0430\u0445 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d. \u041d\u0430\u043a\u0430\u043f\u043b\u0438\u0432\u0430\u044e\u0442\u0441\u044f \u0441\u0442\u0430\u043a\u0438, \u043a\u0430\u0436\u0434\u044b\u0439 \u0441\u0442\u0430\u043a \u0434\u0430\u0435\u0442 \u0431\u043e\u043d\u0443\u0441 \u043a \u0443\u0440\u043e\u043d\u0443. \u041c\u0430\u043a\u0441\u0438\u043c\u0443\u043c 20 \u0441\u0442\u0430\u043a\u043e\u0432.",
    type: "positive",
    icon: "MissHitBoost",
    imgUrl: "https://media.prison.coffee.agency/effects/MISS_HIT_BOOST.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "stacks", "name": "Стаков", "format": "absolute"}, {"key": "damagePerStack", "name": "Урон за стак", "format": "percent"}],
  },
  {
    id: "potion_damage_type_change",
    name: "\u0421\u043c\u0435\u043d\u0430 \u0441\u0442\u0438\u0445\u0438\u0438",
    desc: "\u041a\u0430\u0436\u0434\u043e\u0435 3-\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0441\u043a\u0438\u043b\u043b\u0430 \u043c\u0435\u043d\u044f\u0435\u0442 \u0442\u0438\u043f \u0443\u0440\u043e\u043d\u0430 \u043d\u0430 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0439 (\u043a\u043e\u043b\u044e\u0449\u0438\u0439/\u0440\u0443\u0431\u044f\u0449\u0438\u0439/\u0434\u0440\u043e\u0431\u044f\u0449\u0438\u0439).",
    type: "positive",
    icon: "ChangeDamageType",
    imgUrl: "https://media.prison.coffee.agency/effects/CHANGE_DAMAGE_TYPE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0421\u0430\u043c\u043e\u0433\u043e\u043d",
    srcLink: "baryga",
    params: [{"key": "skillUseCount", "name": "Использований скилла", "format": "absolute"}],
  },
  {
    id: "steal_weapon",
    name: "\u0412\u043e\u0440 \u0432 \u0437\u0430\u043a\u043e\u043d\u0435",
    desc: "\u0421\u0435\u0440\u0433\u0435\u0439 \u0443\u043a\u0440\u0430\u043b \u043e\u0440\u0443\u0436\u0438\u0435 \u0443 \u0432\u0440\u0430\u0433\u0430",
    type: "negative",
    icon: "WillToLife",
    imgUrl: "https://media.prison.coffee.agency/effects/SECOND_BREATH.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "ponzi_scheme",
    name: "\u0421\u0445\u0435\u043c\u0430 \u041f\u0438\u043d\u043e\u043a\u043a\u0438\u043e",
    desc: "\u0423\u0440\u043e\u043d \u0421\u0435\u0440\u0433\u0435\u044f \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043d\u0430 30% \u0437\u0430 \u043a\u0430\u0436\u0434\u0443\u044e \u0441\u043e\u044e\u0437\u043d\u0443\u044e \u0448\u0435\u0441\u0442\u0435\u0440\u043a\u0443 \u043d\u0430 \u043f\u043e\u043b\u0435",
    type: "positive",
    icon: "Provocation",
    imgUrl: "",
    emoji: "\ud83c\udfad",
    src: "",
    srcLink: "",
    params: [{"key": "amplificationPercent", "name": "Увеличение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "poison",
    name: "\u042f\u0434",
    desc: "\u041d\u0430\u043d\u043e\u0441\u0438\u0442 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u044e\u0449\u0438\u0439\u0441\u044f \u0443\u0440\u043e\u043d \u0441\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0435\u043c. \u041a\u0430\u0436\u0434\u044b\u0439 \u0442\u0438\u043a \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d.",
    type: "negative",
    icon: "Poison",
    imgUrl: "",
    emoji: "\u2620\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "baseDamage", "name": "Базовый урон", "format": "absolute"}, {"key": "damageDealedTimes", "name": "Количество тиков", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "zhan_poison",
    name: "\u041e\u0442\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u044f\u0434\u043e\u043c \u0416\u0430\u043d\u0430",
    desc: "\u041d\u0430\u043d\u043e\u0441\u0438\u0442 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u044e\u0449\u0438\u0439\u0441\u044f \u0443\u0440\u043e\u043d \u0441\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0435\u043c. \u041a\u0430\u0436\u0434\u044b\u0439 \u0442\u0438\u043a \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d. \u0420\u0430\u0437\u044a\u0435\u0434\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e",
    type: "negative",
    icon: "PoisonZhan",
    imgUrl: "",
    emoji: "\ud83d\udc0d",
    src: "\u0416\u0430\u043d",
    srcLink: "bosses",
    params: [{"key": "baseDamage", "name": "Базовый урон", "format": "absolute"}, {"key": "armorReduction", "name": "Снижение брони за тик", "format": "absolute"}, {"key": "damageDealedTimes", "name": "Количество тиков", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "unstable_formula",
    name: "\u041d\u0435\u0441\u0442\u0430\u0431\u0438\u043b\u044c\u043d\u0430\u044f \u0444\u043e\u0440\u043c\u0443\u043b\u0430",
    desc: "\u0416\u0430\u043d \u0441\u043c\u0435\u0448\u0438\u0432\u0430\u0435\u0442 \u043e\u0441\u043e\u0431\u0443\u044e \u0441\u043c\u0435\u0441\u044c, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0432\u0437\u043e\u0440\u0432\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 8 \u0445\u043e\u0434\u043e\u0432 \u0438 \u043d\u0430\u043d\u0435\u0441\u0435\u0442 \u043e\u0433\u0440\u043e\u043c\u043d\u044b\u0439 \u0443\u0440\u043e\u043d \u0432\u0441\u0435\u043c \u0432\u0440\u0430\u0433\u0430\u043c. \u0414\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0441\u043f\u043e\u0441\u043e\u0431 \u0437\u0430\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0435\u0433\u043e \u0432\u044b\u0440\u043e\u043d\u0438\u0442\u044c \u0435\u0435... \u0415\u0441\u043b\u0438 \u0416\u0430\u043d \u0443\u0440\u043e\u043d\u0438\u0442 \u043a\u043e\u043b\u0431\u0443, \u0442\u043e \u0443\u0440\u043e\u043d \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u043e\u043d \u0441\u0430\u043c",
    type: "positive",
    icon: "UnstableFormula",
    imgUrl: "",
    emoji: "\u2697\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "damage", "name": "Урон", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "poison_weakness",
    name: "\u0423\u044f\u0437\u0432\u0438\u043c\u043e\u0441\u0442\u044c \u043a \u044f\u0434\u0443",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u044b\u0439 \u0443\u0440\u043e\u043d \u043e\u0442 \u044f\u0434\u0430 \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442.",
    type: "negative",
    icon: "WeaknessPoison",
    imgUrl: "",
    emoji: "\ud83e\udd22",
    src: "",
    srcLink: "",
    params: [{"key": "amplificationPercent", "name": "Увеличение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "alco",
    name: "\u041e\u043f\u044c\u044f\u043d\u0435\u043d\u0438\u0435",
    desc: "\u0421\u043d\u0438\u0436\u0430\u0435\u0442 \u043c\u0435\u0442\u043a\u043e\u0441\u0442\u044c. \u0427\u0435\u043c \u0431\u043e\u043b\u044c\u0448\u0435 \u0432\u044b\u043f\u0438\u043b \u2014 \u0442\u0435\u043c \u0434\u0430\u043b\u044c\u0448\u0435 \u043b\u0435\u0442\u044f\u0442 \u0443\u0434\u0430\u0440\u044b.",
    type: "negative",
    icon: "Alco",
    imgUrl: "https://media.prison.coffee.agency/effects/MINERAL_WATER.png",
    emoji: "\u2694\ufe0f",
    src: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Степень опьянения", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "pain",
    name: "\u0411\u043e\u043b\u044c",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u0435\u0441\u044c \u0432\u0445\u043e\u0434\u044f\u0449\u0438\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442",
    type: "negative",
    icon: "Pain",
    imgUrl: "",
    emoji: "\ud83d\ude23",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Увеличение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "bash",
    name: "\u041e\u0433\u043b\u0443\u0448\u0435\u043d",
    desc: "\u041d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u043e\u0432\u0430\u0442\u044c \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0445\u043e\u0434\u043e\u0432.",
    type: "negative",
    icon: "Bash",
    imgUrl: "",
    emoji: "\ud83d\udcab",
    src: "",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "blindness",
    name: "\u041e\u0441\u043b\u0435\u043f\u043b\u0435\u043d",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c, \u0438\u0437-\u0437\u0430 \u0447\u0435\u0433\u043e \u0441\u043b\u043e\u0436\u043d\u0435\u0435 \u043f\u043e\u043f\u0430\u0441\u0442\u044c \u043f\u043e \u0446\u0435\u043b\u044f\u043c.",
    type: "negative",
    icon: "Blindness",
    imgUrl: "",
    emoji: "\ud83d\udc41\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "missCoef", "name": "Шанс промаха", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "fear",
    name: "\u0421\u0442\u0440\u0430\u0445",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u043d\u0430\u043d\u043e\u0441\u0438\u043c\u044b\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442. \u041d\u0435\u043b\u044c\u0437\u044f \u0440\u0430\u0441\u0441\u0435\u044f\u0442\u044c.",
    type: "negative",
    icon: "Fear",
    imgUrl: "",
    emoji: "\ud83d\ude31",
    src: "",
    srcLink: "",
    params: [{"key": "damageReduction", "name": "Снижение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "steadfastness",
    name: "\u041d\u0435\u043f\u043e\u043a\u043e\u043b\u0435\u0431\u0438\u043c\u043e\u0441\u0442\u044c",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u044b\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442",
    type: "positive",
    icon: "Gigachad",
    imgUrl: "",
    emoji: "\ud83d\udcaa",
    src: "",
    srcLink: "",
    params: [{"key": "damageReduction", "name": "Снижение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "primal_fear",
    name: "\u041f\u0435\u0440\u0432\u043e\u0431\u044b\u0442\u043d\u044b\u0439 \u0441\u0442\u0440\u0430\u0445",
    desc: "\u0428\u0430\u043d\u0441 \u043f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0445\u043e\u0434 \u0438\u0437-\u0437\u0430 \u043f\u0430\u0440\u0430\u043b\u0438\u0437\u0443\u044e\u0449\u0435\u0433\u043e \u0441\u0442\u0440\u0430\u0445\u0430.",
    type: "negative",
    icon: "Fear",
    imgUrl: "",
    emoji: "\ud83d\ude31",
    src: "",
    srcLink: "",
    params: [{"key": "procChance", "name": "Шанс пропуска", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "adaptation",
    name: "\u0410\u0434\u0430\u043f\u0442\u0430\u0446\u0438\u044f",
    desc: "\u0426\u0435\u043b\u044c \u0430\u0434\u0430\u043f\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u043a \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e\u043c\u0443 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044e \u043e\u0434\u043d\u043e\u0433\u043e \u0438 \u0442\u043e\u0433\u043e \u0436\u0435 \u043d\u0430\u0432\u044b\u043a\u0430, \u0441\u043d\u0438\u0436\u0430\u044f \u0435\u0433\u043e \u044d\u0444\u0444\u0435\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c.",
    type: "negative",
    icon: "XRed",
    imgUrl: "",
    emoji: "\u274c",
    src: "",
    srcLink: "",
    params: [{"key": "lastSkillId", "name": "Адаптированный навык", "format": "absolute"}, {"key": "usagesInARow", "name": "Последовательные использования", "format": "absolute"}, {"key": "missCoef", "name": "Увеличение шанса промаха", "format": "percent"}],
  },
  {
    id: "bleeding",
    name: "\u041a\u0440\u043e\u0432\u043e\u0442\u0435\u0447\u0435\u043d\u0438\u0435",
    desc: "\u041d\u0430\u043d\u043e\u0441\u0438\u0442 \u043f\u0435\u0440\u0438\u043e\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d \u043a\u0430\u0436\u0434\u044b\u0439 \u0440\u0430\u0443\u043d\u0434. \u0421\u0442\u0430\u043a\u0430\u0435\u0442\u0441\u044f \u0438 \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u0435\u0442 \u0434\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043f\u0440\u0438 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e\u043c \u043d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u0438.",
    type: "negative",
    icon: "Blood",
    imgUrl: "",
    emoji: "\ud83e\ude78",
    src: "",
    srcLink: "",
    params: [{"key": "scaleValue", "name": "Урон кровотечением за раунд", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "bladeInTheDark",
    name: "\u041b\u0435\u0437\u0432\u0438\u0435 \u0432 \u0442\u0435\u043c\u043d\u043e\u0442\u0435",
    desc: "\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u043f\u043e 2 \u0435\u0434\u0438\u043d\u0438\u0446\u044b \u0443\u0440\u043e\u043d\u0430 \u0437\u0430 \u0441\u0442\u0430\u043a \u043f\u0440\u0438 \u043a\u0430\u0436\u0434\u043e\u043c \u0443\u0434\u0430\u0440\u0435 \u0411\u0430\u043d\u043a\u0438\u0440\u0430",
    type: "negative",
    icon: "BladeInTheDark",
    imgUrl: "",
    emoji: "\ud83d\udde1\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "baseDamage", "name": "Базовый урон за стак", "format": "absolute"}, {"key": "stacks", "name": "Текущие стаки", "format": "absolute"}],
  },
  {
    id: "taunt",
    name: "\u041f\u0440\u043e\u0432\u043e\u043a\u0430\u0446\u0438\u044f",
    desc: "\u0417\u0430\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0432\u0440\u0430\u0433\u043e\u0432 \u0430\u0442\u0430\u043a\u043e\u0432\u0430\u0442\u044c \u044d\u0442\u043e\u0442 \u044e\u043d\u0438\u0442. \u0422\u0430\u043a\u0436\u0435 \u043f\u043e\u0432\u044b\u0448\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e.",
    type: "positive",
    icon: "Provocation",
    imgUrl: "",
    emoji: "\ud83c\udfad",
    src: "",
    srcLink: "",
    params: [{"key": "armorBoost", "name": "Увеличение брони", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "armor_boost",
    name: "\u0411\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e, \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u044f \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u044b\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d.",
    type: "positive",
    icon: "Armor",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "\u041b\u043e\u043c",
    srcLink: "minions",
    params: [{"key": "armorBoost", "name": "Увеличение брони", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "armor_reduction",
    name: "\u0421\u043d\u0438\u0436\u0435\u043d\u043d\u0430\u044f \u0431\u0440\u043e\u043d\u044f",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e \u0432 \u043f\u0440\u043e\u0446\u0435\u043d\u0442\u0430\u0445, \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u044f \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u044b\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d.",
    type: "negative",
    icon: "ArmorReduction2",
    imgUrl: "",
    emoji: "\ud83e\ude93",
    src: "",
    srcLink: "",
    params: [{"key": "armorReduction", "name": "Уменьшение брони", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "beer_armor_crush",
    name: "\u0420\u0430\u0437\u0440\u0443\u0448\u0435\u043d\u0438\u0435 \u0431\u0440\u043e\u043d\u0438",
    desc: "\u041f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u043e \u0441\u043d\u0438\u0436\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e \u043d\u0430 \u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435. \u041d\u0435\u043b\u044c\u0437\u044f \u0440\u0430\u0437\u0432\u0435\u044f\u0442\u044c.",
    type: "negative",
    icon: "ArmorReduction3",
    imgUrl: "",
    emoji: "\ud83d\udca5",
    src: "\u0420\u0430\u0441\u0445\u043e\u0434\u043d\u0438\u043a",
    srcLink: "baryga",
    params: [{"key": "value", "name": "Снижение брони", "format": "absolute"}],
  },
  {
    id: "into_shreds",
    name: "\u0412 \u043a\u043b\u043e\u0447\u044c\u044f",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e, \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u044f \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u044b\u0439 \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0443\u0440\u043e\u043d.",
    type: "negative",
    icon: "ArmorReduction1",
    imgUrl: "",
    emoji: "\u26a1",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Уменьшение брони", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "damage_reduction",
    name: "\u041e\u0441\u043b\u0430\u0431\u043b\u0435\u043d\u043d\u044b\u0439",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u043d\u0430\u043d\u043e\u0441\u0438\u043c\u044b\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442.",
    type: "negative",
    icon: "Weakness",
    imgUrl: "",
    emoji: "\ud83d\ude1e",
    src: "",
    srcLink: "",
    params: [{"key": "damageReduction", "name": "Снижение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "heal_over_time",
    name: "\u0420\u0435\u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u044f",
    desc: "\u0412\u043e\u0441\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u0442 \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u0435 \u043a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434 \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f.",
    type: "positive",
    icon: "Regeneration",
    imgUrl: "https://media.prison.coffee.agency/effects/REGENERATION.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "healPercentage", "name": "Лечение за ход", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "evasion_boost",
    name: "\u0423\u043a\u043b\u043e\u043d\u0447\u0438\u0432\u044b\u0439",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0448\u0430\u043d\u0441 \u0443\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044f \u043e\u0442 \u0432\u0445\u043e\u0434\u044f\u0449\u0438\u0445 \u0430\u0442\u0430\u043a.",
    type: "positive",
    icon: "EvasionBuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "evasionBoost", "name": "Увеличение уклонения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "respect_loss",
    name: "\u041d\u0435\u0443\u0432\u0430\u0436\u0430\u0435\u043c\u044b\u0439",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0443\u0432\u0430\u0436\u0435\u043d\u0438\u0435 \u0432 \u043f\u0440\u043e\u0446\u0435\u043d\u0442\u0430\u0445",
    type: "negative",
    icon: "InspiredLightBlue",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "respectReductionPercent", "name": "Уменьшение уважения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "berserk",
    name: "\u0411\u0435\u0440\u0441\u0435\u0440\u043a",
    desc: "\u0417\u043d\u0430\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043d\u0430\u043d\u043e\u0441\u0438\u043c\u044b\u0439 \u0443\u0440\u043e\u043d, \u043d\u043e \u0441\u043d\u0438\u0436\u0430\u0435\u0442 \u0431\u0440\u043e\u043d\u044e \u0434\u043e \u043c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f.",
    type: "mixed",
    icon: "Berserk",
    imgUrl: "",
    emoji: "\ud83d\udd25",
    src: "",
    srcLink: "",
    params: [{"key": "damageBoost", "name": "Увеличение урона", "format": "percent"}, {"key": "armorReduction", "name": "Броня снижена до", "format": "absolute"}],
  },
  {
    id: "berserk_consumable",
    name: "\u0411\u043e\u0435\u0432\u0430\u044f \u044f\u0440\u043e\u0441\u0442\u044c",
    desc: "\u0412\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043d\u0430\u043d\u043e\u0441\u0438\u043c\u044b\u0439 \u0443\u0440\u043e\u043d \u043e\u0442 \u0443\u043f\u043e\u0442\u0440\u0435\u0431\u043b\u0435\u043d\u0438\u044f \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0445 \u043a\u043e\u043d\u0444\u0435\u0442.",
    type: "positive",
    icon: "Berserk",
    imgUrl: "",
    emoji: "\ud83d\udd25",
    src: "",
    srcLink: "",
    params: [{"key": "damageBoost", "name": "Увеличение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "oldmansWill",
    name: "\u0417\u0430\u0432\u0435\u0449\u0430\u043d\u0438\u0435 \u0414\u0435\u0434\u0430",
    desc: "\u041f\u043e\u0441\u043b\u0435 \u0441\u043c\u0435\u0440\u0442\u0438 \u0414\u0435\u0434\u0430 \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d \u0438 \u0448\u0430\u043d\u0441 \u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0443\u0434\u0430\u0440\u0430 \u0434\u043b\u044f \u0432\u0441\u0435\u0445 \u0441\u043e\u044e\u0437\u043d\u0438\u043a\u043e\u0432.",
    type: "positive",
    icon: "SkullRed",
    imgUrl: "https://media.prison.coffee.agency/effects/CRIT_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0414\u0435\u0434",
    srcLink: "minions",
    params: [{"key": "damageBoost", "name": "Увеличение урона", "format": "percent"}, {"key": "critChanceBoost", "name": "Увеличение шанса крита", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "damage_boost",
    name: "\u0412\u043e\u043e\u0434\u0443\u0448\u0435\u0432\u043b\u0435\u043d",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043d\u0430\u043d\u043e\u0441\u0438\u043c\u044b\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442 \u0434\u043b\u044f \u0432\u0441\u0435\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u044b.",
    type: "positive",
    icon: "InspiredPurple",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "damageBoostPercent", "name": "Увеличение урона", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "crit_chance_boost",
    name: "\u0421\u043e\u0441\u0440\u0435\u0434\u043e\u0442\u043e\u0447\u0435\u043d\u043d\u043e\u0441\u0442\u044c",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0448\u0430\u043d\u0441 \u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0443\u0434\u0430\u0440\u0430 \u0434\u043b\u044f \u0432\u0441\u0435\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u044b.",
    type: "positive",
    icon: "Provocation",
    imgUrl: "",
    emoji: "\ud83c\udfad",
    src: "",
    srcLink: "",
    params: [{"key": "critChanceBoostPercent", "name": "Увеличение шанса крита", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "slay_power",
    name: "\u0421\u0438\u043b\u0430",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d",
    type: "positive",
    icon: "Sword1Red",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "value", "name": "Сила", "format": "absolute"}],
  },
  {
    id: "slay_agility",
    name: "\u041b\u043e\u0432\u043a\u043e\u0441\u0442\u044c",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0431\u0440\u043e\u043d\u0438, \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u043e\u0435 \u043e\u0442 \u043a\u0430\u0440\u0442",
    type: "positive",
    icon: "EvasionBuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "value", "name": "Ловкость", "format": "absolute"}],
  },
  {
    id: "slay_weakness",
    name: "\u0421\u043b\u0430\u0431\u043e\u0441\u0442\u044c",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0443\u0440\u043e\u043d \u043d\u0430 25%",
    type: "negative",
    icon: "Weakness",
    imgUrl: "",
    emoji: "\ud83d\ude1e",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "slay_maneuverability",
    name: "\u041c\u0430\u043d\u0451\u0432\u0440\u0435\u043d\u043d\u043e\u0441\u0442\u044c",
    desc: "\u041b\u044e\u0431\u043e\u0439 \u0432\u0445\u043e\u0434\u044f\u0449\u0438\u0439 \u0443\u0440\u043e\u043d \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442\u0441\u044f \u0434\u043e 1",
    type: "positive",
    icon: "Armor",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [],
  },
  {
    id: "slay_vulnerability",
    name: "\u0423\u044f\u0437\u0432\u0438\u043c\u043e\u0441\u0442\u044c",
    desc: "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u043c\u044b\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 50%",
    type: "positive",
    icon: "Pain",
    imgUrl: "",
    emoji: "\ud83d\ude23",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "slay_demon_form",
    name: "\u0414\u0435\u043c\u043e\u043d\u0441\u043a\u0430\u044f \u0444\u043e\u0440\u043c\u0430",
    desc: "\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 2 \u0441\u0438\u043b\u044b \u0432 \u043d\u0430\u0447\u0430\u043b\u0435 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0445\u043e\u0434\u0430",
    type: "positive",
    icon: "Sword1Red",
    imgUrl: "https://media.prison.coffee.agency/effects/BONUS_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "value", "name": "Сила", "format": "absolute"}],
  },
  {
    id: "slay_metallic",
    name: "\u041c\u0435\u0442\u0430\u043b\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
    desc: "\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 3 \u0431\u0440\u043e\u043d\u0438 \u0432 \u043a\u043e\u043d\u0446\u0435 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0445\u043e\u0434\u0430",
    type: "positive",
    icon: "Armor2",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "value", "name": "Броня", "format": "absolute"}],
  },
  {
    id: "barricade",
    name: "\u0411\u0430\u0440\u0440\u0438\u043a\u0430\u0434\u0430",
    desc: "\u0411\u0440\u043e\u043d\u044f \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435 \u0441\u0431\u0440\u0430\u0441\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0432 \u043a\u043e\u043d\u0446\u0435 \u0445\u043e\u0434\u0430",
    type: "positive",
    icon: "Armor",
    imgUrl: "https://media.prison.coffee.agency/effects/ARMOR.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [],
  },
  {
    id: "attacks_gain_block",
    name: "\u042f\u0440\u043e\u0441\u0442\u044c",
    desc: "\u041a\u0430\u0436\u0434\u0430\u044f \u0430\u0442\u0430\u043a\u0430 \u0432 \u044d\u0442\u043e\u043c \u0445\u043e\u0434\u0443 \u0434\u0430\u0435\u0442 3 \u0431\u0440\u043e\u043d\u0438",
    type: "positive",
    icon: "SkullRed",
    imgUrl: "https://media.prison.coffee.agency/effects/CRIT_DAMAGE.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Броня", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "slay_contusion",
    name: "\u041a\u043e\u043d\u0442\u0443\u0437\u0438\u044f",
    desc: "\u0412\u0441\u0435 \u043a\u0430\u0440\u0442\u044b \u0438\u043c\u0435\u044e\u0442 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u0443\u044e \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c",
    type: "negative",
    icon: "Bash",
    imgUrl: "",
    emoji: "\ud83d\udcab",
    src: "\u0412\u0438\u0442\u043e (\u0441\u0435\u0442)",
    srcLink: "",
    params: [{"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "burnman_burn",
    name: "\u041e\u0436\u043e\u0433 \u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a\u0430",
    desc: "\u041f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u0443\u0440\u043e\u043d \u0433\u043e\u0440\u0435\u043d\u0438\u0435\u043c \u043a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434",
    type: "negative",
    icon: "Burnout",
    imgUrl: "",
    emoji: "\ud83c\udf21\ufe0f",
    src: "\u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a",
    srcLink: "bosses",
    params: [{"key": "value", "name": "Урон от ожога", "format": "absolute"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "burnman_heat",
    name: "\u0416\u0430\u0440",
    desc: "\u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a \u043d\u0430\u043a\u0430\u043f\u043b\u0438\u0432\u0430\u0435\u0442 \u0436\u0430\u0440. \u041f\u0440\u0438 50 - \u0441\u043d\u0438\u0436\u0430\u0435\u0442 \u0443\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u0435 \u0432\u0441\u0435\u0445 \u0432\u0440\u0430\u0433\u043e\u0432 \u043d\u0430 50%. \u041f\u0440\u0438 100 - \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043e\u043d \u043d\u0430 10% \u0438 \u043d\u0430\u043d\u043e\u0441\u0438\u0442 100 \u0447\u0438\u0441\u0442\u043e\u0433\u043e \u0443\u0440\u043e\u043d\u0430 \u0432\u0441\u0435\u043c",
    type: "positive",
    icon: "Heat",
    imgUrl: "",
    emoji: "\ud83c\udf21\ufe0f",
    src: "\u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a",
    srcLink: "bosses",
    params: [{"key": "value", "name": "Уровень жара", "format": "absolute"}],
  },
  {
    id: "burnman_heat_evasion_debuff",
    name: "\u0420\u0430\u0441\u043a\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u0432\u043e\u0437\u0434\u0443\u0445",
    desc: "\u0416\u0430\u0440 \u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a\u0430 \u0441\u043d\u0438\u0436\u0430\u0435\u0442 \u0443\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u0435 \u043d\u0430 50%",
    type: "negative",
    icon: "EvasionDebuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "\u041f\u0430\u044f\u043b\u044c\u043d\u0438\u043a",
    srcLink: "bosses",
    params: [{"key": "evasionReduction", "name": "Снижение уклонения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
  {
    id: "vito_debt",
    name: "\u0414\u043e\u043b\u0433 \u0412\u0438\u0442\u043e",
    desc: "\u0412\u044b \u0434\u043e\u043b\u0436\u043d\u044b \u0412\u0438\u0442\u043e. \u041a\u0430\u0436\u0434\u044b\u0439 \u0441\u0442\u0430\u043a \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u0445\u043e\u0434\u044f\u0449\u0438\u0439 \u0443\u0440\u043e\u043d \u043d\u0430 15%. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u0441\u043a\u0438\u043b\u043b '\u0412\u044b\u043f\u043b\u0430\u0442\u0438\u0442\u044c \u0434\u043e\u043b\u0433' \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u0433\u0430\u0441\u0438\u0442\u044c (\u0441\u043d\u0438\u0436\u0430\u0435\u0442 \u043c\u0430\u043a\u0441 HP \u043d\u0430 100). \u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0433\u0430\u0448\u0435\u043d\u0438\u044f \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442\u0441\u044f \u043d\u0430 10 \u043a\u0430\u0436\u0434\u044b\u0439 \u0445\u043e\u0434",
    type: "negative",
    icon: "Coin",
    imgUrl: "https://media.prison.coffee.agency/effects/MINERAL_WATER.png",
    emoji: "\u2694\ufe0f",
    src: "\u0412\u0438\u0442\u043e",
    srcLink: "bosses",
    params: [{"key": "stacks", "name": "Стаков долга", "format": "absolute"}, {"key": "repaymentCost", "name": "Стоимость погашения", "format": "absolute"}, {"key": "turnsActive", "name": "Ходов активно", "format": "absolute"}],
  },
  {
    id: "vito_collateral",
    name: "\u0417\u0430\u043b\u043e\u0433 \u0412\u0438\u0442\u043e",
    desc: "\u0412\u0438\u0442\u043e \u0437\u0430\u0431\u0440\u0430\u043b \u0432\u0430\u0448\u0438 \u043d\u0430\u0432\u044b\u043a\u0438 \u043a\u0430\u043a \u0437\u0430\u043b\u043e\u0433. \u0412\u043c\u0435\u0441\u0442\u043e \u043d\u0438\u0445 \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 \u043d\u0435\u0433\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u043d\u0430\u0432\u044b\u043a\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043c\u043e\u0436\u043d\u043e \u043f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430 \u0441\u0435\u0431\u044f",
    type: "negative",
    icon: "SkullBlack",
    imgUrl: "",
    emoji: "\u2620\ufe0f",
    src: "\u0412\u0438\u0442\u043e",
    srcLink: "bosses",
    params: [],
  },
  {
    id: "evasion_reduction",
    name: "\u0421\u043d\u0438\u0436\u0435\u043d\u0438\u0435 \u0443\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044f",
    desc: "\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0448\u0430\u043d\u0441 \u0443\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044f \u043e\u0442 \u0430\u0442\u0430\u043a",
    type: "negative",
    icon: "EvasionDebuff",
    imgUrl: "https://media.prison.coffee.agency/effects/EVASION.png",
    emoji: "\u2694\ufe0f",
    src: "",
    srcLink: "",
    params: [{"key": "value", "name": "Снижение уклонения", "format": "percent"}, {"key": "duration", "name": "Длительность", "format": "absolute"}, {"key": "maxDuration", "name": "Максимальная Длительность", "format": "absolute"}],
  },
];

const TYPE_META = {
  positive: { label: "Позитивный", color: "#2ecc71", bg: "rgba(46,204,113,.12)" },
  negative: { label: "Негативный", color: "#e74c3c", bg: "rgba(231,76,60,.12)"  },
  mixed:    { label: "Смешанный",  color: "#f1c40f", bg: "rgba(241,196,15,.12)" },
};

function getCategory(ef) {
  const id = ef.id;
  if (id.startsWith("potion_"))                    return "potion";
  if (["burnman_burn","burnman_heat","burnman_heat_evasion_debuff","burnout"].includes(id)) return "boss";
  if (id.includes("dipipi"))                       return "boss";
  if (id.includes("iceman"))                       return "boss";
  if (id.includes("zahar"))                        return "boss";
  if (id.includes("foma"))                         return "boss";
  if (id.includes("vito"))                         return "boss";
  if (id.includes("zhan"))                         return "boss";
  if (id.includes("boss_authority") || id.includes("primal_fear")) return "boss";
  if (id.startsWith("slay_") || id.includes("ponzi") || id.includes("vitos_glory")) return "skill";
  if (["analgin","carbon","sedative","alco","beer_intoxication"].includes(id)) return "consumable";
  return ef.type;
}

const CATEGORIES = [
  { id:"all",      label:"Все",          icon:"⚡" },
  { id:"positive", label:"Баффы",        icon:"✅", type: true },
  { id:"negative", label:"Дебаффы",      icon:"❌", type: true },
  { id:"mixed",    label:"Смешанные",    icon:"⚠️", type: true },
  { id:"potion",   label:"Самогон",      icon:"🍺" },
  { id:"boss",     label:"Боссы",        icon:"👹" },
  { id:"skill",    label:"Скиллы/Сеты", icon:"🗡️" },
  { id:"consumable",label:"Расходники",  icon:"💊" },
];


export async function renderEffects() {
  const root = document.createElement("div");
  root.className = "effects-page";

  const state = { search: "", cat: "all", view: "grid", expanded: null };

  const countsByCat = {};
  CATEGORIES.forEach(c => {
    if (c.id === "all") { countsByCat.all = STATUS_EFFECTS.length; return; }
    if (c.type) {
      countsByCat[c.id] = STATUS_EFFECTS.filter(e => e.type === c.id).length;
    } else {
      countsByCat[c.id] = STATUS_EFFECTS.filter(e => getCategory(e) === c.id).length;
    }
  });

  root.innerHTML = `
    <div class="card">
      <div class="row" style="align-items:flex-start;">
        <div>
          <div class="card-title">⚡ ЭФФЕКТЫ БОЯ - СТРАНИЦА НЕ ГОТОВА</div>
          <div class="card-sub">Статусы · Баффы · Дебаффы · Аура боссов</div>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;">
          <span class="badge" style="background:rgba(46,204,113,.15);color:#2ecc71;">✅ ${countsByCat.positive}</span>
          <span class="badge" style="background:rgba(231,76,60,.15);color:#e74c3c;">❌ ${countsByCat.negative}</span>
          <span class="badge" style="background:rgba(241,196,15,.15);color:#f1c40f;">⚠️ ${countsByCat.mixed}</span>
        </div>
      </div>
    </div>

    <!-- Поиск + переключатель вида -->
    <div class="card no-accent" style="padding:12px 14px;">
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        <div class="search-wrap" style="flex:1;">
          <span class="search-icon">🔍</span>
          <input class="input" id="effSearch" placeholder="Поиск по названию или описанию…" style="padding-left:36px;" />
        </div>
        <div class="eff-view-toggle">
          <button class="eff-view-btn active" data-view="grid" title="Сетка" type="button">⊞</button>
          <button class="eff-view-btn" data-view="list" title="Список" type="button">☰</button>
        </div>
      </div>
      <div class="eff-cat-bar" id="effCats">
        ${CATEGORIES.map(c => `
          <button class="eff-cat-btn ${c.id === "all" ? "active" : ""}" data-cat="${c.id}" type="button">
            <span>${c.icon}</span>
            <span>${c.label}</span>
            <span class="eff-cat-count">${countsByCat[c.id] ?? 0}</span>
          </button>
        `).join("")}
      </div>
    </div>

    <div id="effMeta" class="muted" style="font-size:11px;padding:0 4px 4px;"></div>
    <div id="effList"></div>
  `;

  root.querySelector("#effSearch").addEventListener("input", e => {
    clearTimeout(e.target._t);
    e.target._t = setTimeout(() => { state.search = e.target.value.toLowerCase().trim(); state.expanded = null; render(); }, 150);
  });

  root.querySelector("#effCats").addEventListener("click", e => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    state.expanded = null;
    root.querySelectorAll(".eff-cat-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === state.cat));
    render();
  });

  root.querySelector(".eff-view-toggle").addEventListener("click", e => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    state.view = btn.dataset.view;
    root.querySelectorAll(".eff-view-btn").forEach(b => b.classList.toggle("active", b.dataset.view === state.view));
    render();
  });

  function filter() {
    return STATUS_EFFECTS.filter(ef => {
      const cat = state.cat;
      const matchCat = cat === "all"
        || (cat === "positive" && ef.type === "positive")
        || (cat === "negative" && ef.type === "negative")
        || (cat === "mixed"    && ef.type === "mixed")
        || getCategory(ef) === cat;
      const matchSearch = !state.search
        || ef.name.toLowerCase().includes(state.search)
        || (ef.desc || "").toLowerCase().includes(state.search);
      return matchCat && matchSearch;
    });
  }

  function render() {
    const list = filter();
    const meta = root.querySelector("#effMeta");
    const container = root.querySelector("#effList");

    meta.textContent = `Показано: ${list.length} из ${STATUS_EFFECTS.length}`;

    if (!list.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Ничего не найдено</div></div>`;
      return;
    }

    if (state.view === "list") {
      renderListView(list, container);
    } else {
      renderGridView(list, container);
    }
  }

  function renderGridView(list, container) {
    container.className = "eff-grid";
    container.innerHTML = list.map(ef => {
      const meta = TYPE_META[ef.type] || TYPE_META.positive;
      const isExp = state.expanded === ef.id;
      return `
        <div class="eff-card ${isExp ? "expanded" : ""}" data-efid="${esc(ef.id)}">
          <div class="eff-card-head" style="border-left:3px solid ${meta.color};">
            <div class="eff-ico-wrap" style="background:${meta.bg};">
              ${ef.imgUrl
                ? `<img src="${esc(ef.imgUrl)}" class="eff-ico-img" loading="lazy" onerror="this.parentElement.innerHTML='${ef.emoji}';this.parentElement.style.fontSize='20px';" />`
                : `<span class="eff-ico-emoji">${ef.emoji}</span>`}
            </div>
            <div class="eff-card-meta">
              <div class="eff-name">${esc(ef.name)}</div>
              <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-top:3px;">
                <span class="eff-type-chip" style="color:${meta.color};background:${meta.bg};">${meta.label}</span>
                ${ef.src ? `<span class="eff-src-chip">${esc(ef.src)}</span>` : ""}
              </div>
            </div>
            <button class="eff-expand-btn" data-efid="${esc(ef.id)}" type="button">${isExp ? "▲" : "▼"}</button>
          </div>
          ${ef.desc ? `<div class="eff-desc">${esc(ef.desc)}</div>` : ""}
          ${isExp && ef.params.length ? `
            <div class="eff-params-table">
              ${ef.params.map(p => `
                <div class="eff-param-row">
                  <span class="eff-param-name">${esc(p.name)}</span>
                  <span class="eff-param-fmt muted">${p.format === "percent" ? "%" : p.format === "absolute" ? "#" : p.format}</span>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </div>`;
    }).join("");

    container.querySelectorAll(".eff-expand-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = btn.dataset.efid;
        state.expanded = state.expanded === id ? null : id;
        render();
      });
    });
    container.querySelectorAll(".eff-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.dataset.efid;
        state.expanded = state.expanded === id ? null : id;
        render();
      });
    });
  }

  function renderListView(list, container) {
    container.className = "eff-list";
    container.innerHTML = list.map(ef => {
      const meta = TYPE_META[ef.type] || TYPE_META.positive;
      return `
        <div class="eff-list-row" data-efid="${esc(ef.id)}">
          <div class="eff-list-ico" style="background:${meta.bg};">
            ${ef.imgUrl
              ? `<img src="${esc(ef.imgUrl)}" class="eff-ico-img" loading="lazy" onerror="this.parentElement.innerHTML='${ef.emoji}';this.parentElement.style.fontSize='18px';" />`
              : `<span>${ef.emoji}</span>`}
          </div>
          <div class="eff-list-body">
            <span class="eff-name" style="font-size:12px;">${esc(ef.name)}</span>
            ${ef.desc ? `<span class="eff-list-desc muted">${esc(ef.desc)}</span>` : ""}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;">
            <span class="eff-type-chip" style="color:${meta.color};background:${meta.bg};">${meta.label}</span>
            ${ef.src ? `<span class="eff-src-chip">${esc(ef.src)}</span>` : ""}
          </div>
        </div>`;
    }).join("");
  }

  render();
  return root;
}
