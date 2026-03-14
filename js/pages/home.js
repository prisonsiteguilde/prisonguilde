import { esc } from '../utils.js';

export async function renderHome() {
  const root = document.createElement("div");
  root.className = "home-page";

  root.innerHTML = `
    <div class="home-hero">
      <div class="home-hero-content">
        <div class="home-logo">🔒</div>
        <h1 class="home-title">TON PRISON</h1>
        <p class="home-subtitle">Гайды · Рецепты · Калькулятор</p>
        <p class="home-desc">Полное руководство по игре Ton Prison в Telegram. Рецепты крафта, калькулятор добычи, информация о боссах, аффиксах и многом другом.</p>
      </div>
    </div>

    <div class="home-links">
      <h2 class="home-section-title">🔗 Полезные ссылки</h2>
      <div class="home-links-grid">
        <a href="https://t.me/tonprison_bot" target="_blank" rel="noopener" class="home-link-card">
          <div class="home-link-icon">🎮</div>
          <div class="home-link-info">
            <div class="home-link-title">ИГРА</div>
            <div class="home-link-handle">@tonprison_bot</div>
          </div>
          <div class="home-link-arrow">→</div>
        </a>

        <a href="https://t.me/TonPrisonNews" target="_blank" rel="noopener" class="home-link-card">
          <div class="home-link-icon">📰</div>
          <div class="home-link-info">
            <div class="home-link-title">КАНАЛ ПРОЕКТА</div>
            <div class="home-link-handle">@TonPrisonNews</div>
          </div>
          <div class="home-link-arrow">→</div>
        </a>

        <a href="https://t.me/skuffvasya" target="_blank" rel="noopener" class="home-link-card">
          <div class="home-link-icon">💡</div>
          <div class="home-link-info">
            <div class="home-link-title">ИНСАЙДЫ ПРОЕКТА</div>
            <div class="home-link-handle">@skuffvasya</div>
          </div>
          <div class="home-link-arrow">→</div>
        </a>

        <a href="https://t.me/prison_support" target="_blank" rel="noopener" class="home-link-card">
          <div class="home-link-icon">🛠</div>
          <div class="home-link-info">
            <div class="home-link-title">ПОДДЕРЖКА</div>
            <div class="home-link-handle">@prison_support</div>
          </div>
          <div class="home-link-arrow">→</div>
        </a>

        <a href="https://t.me/tonprison_chat" target="_blank" rel="noopener" class="home-link-card">
          <div class="home-link-icon">💬</div>
          <div class="home-link-info">
            <div class="home-link-title">ЧАТ</div>
            <div class="home-link-handle">@tonprison_chat</div>
          </div>
          <div class="home-link-arrow">→</div>
        </a>
      </div>
    </div>

    <div class="home-features">
      <h2 class="home-section-title">📚 Разделы гайда</h2>
      <div class="home-features-grid">
        <a href="#recipes" class="home-feature-card">
          <div class="home-feature-icon">📋</div>
          <div class="home-feature-title">Рецепты</div>
          <div class="home-feature-desc">Все рецепты крафта с ингредиентами</div>
        </a>

        <a href="#calculator" class="home-feature-card">
          <div class="home-feature-icon">🧮</div>
          <div class="home-feature-title">Калькулятор</div>
          <div class="home-feature-desc">Расчёт добычи и эффективности</div>
        </a>

        <a href="#bosses" class="home-feature-card">
          <div class="home-feature-icon">👹</div>
          <div class="home-feature-title">Боссы</div>
          <div class="home-feature-desc">Гайды по всем боссам и награды</div>
        </a>

        <a href="#affixes" class="home-feature-card">
          <div class="home-feature-icon">✨</div>
          <div class="home-feature-title">Аффиксы</div>
          <div class="home-feature-desc">Список всех аффиксов и их эффекты</div>
        </a>

        <a href="#baryga" class="home-feature-card">
          <div class="home-feature-icon">🏪</div>
          <div class="home-feature-title">Барыга</div>
          <div class="home-feature-desc">Товары и цены у барыги</div>
        </a>

        <a href="#minions" class="home-feature-card">
          <div class="home-feature-icon">👥</div>
          <div class="home-feature-title">Шестёрки</div>
          <div class="home-feature-desc">Информация о шестёрках</div>
        </a>

        <a href="#sets" class="home-feature-card">
          <div class="home-feature-icon">📦</div>
          <div class="home-feature-title">Сеты</div>
          <div class="home-feature-desc">Комплекты предметов и бонусы</div>
        </a>

        <a href="#effects" class="home-feature-card">
          <div class="home-feature-icon">💫</div>
          <div class="home-feature-title">Эффекты</div>
          <div class="home-feature-desc">Статусные эффекты и баффы</div>
        </a>

        <a href="#safe" class="home-feature-card">
          <div class="home-feature-icon">🔐</div>
          <div class="home-feature-title">Сейф</div>
          <div class="home-feature-desc">Калькулятор взлома сейфа</div>
        </a>
      </div>
    </div>

    <div class="home-footer">
      <p class="home-footer-text">Сделано с ❤️ для сообщества Ton Prison</p>
      <p class="home-footer-version">Версия гайда: 3.1</p>
    </div>
  `;

  return root;
}
