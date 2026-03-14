// js/preferences.js — User preferences and personalization

const LS_PREFERENCES = "user.preferences.v1";

// Default preferences
const DEFAULT_PREFERENCES = {
  fontSize: "medium", // small, medium, large
  density: "normal", // compact, normal, comfortable
  animations: true,
  soundEffects: false,
  hapticFeedback: true,
  autoSave: true,
  showTutorials: true,
  language: "ru",
};

// Load preferences
function loadPreferences() {
  try {
    return JSON.parse(localStorage.getItem(LS_PREFERENCES) || "null") || DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

// Save preferences
function savePreferences(prefs) {
  localStorage.setItem(LS_PREFERENCES, JSON.stringify(prefs));
}

// Get all preferences
export function getPreferences() {
  return loadPreferences();
}

// Get specific preference
export function getPreference(key) {
  const prefs = loadPreferences();
  return prefs[key] !== undefined ? prefs[key] : DEFAULT_PREFERENCES[key];
}

// Update preference
export function updatePreference(key, value) {
  const prefs = loadPreferences();
  prefs[key] = value;
  savePreferences(prefs);
  applyPreferences();
  return prefs;
}

// Update multiple preferences
export function updatePreferences(updates) {
  const prefs = loadPreferences();
  Object.assign(prefs, updates);
  savePreferences(prefs);
  applyPreferences();
  return prefs;
}

// Reset to defaults
export function resetPreferences() {
  savePreferences(DEFAULT_PREFERENCES);
  applyPreferences();
  return DEFAULT_PREFERENCES;
}

// Apply preferences to DOM
function applyPreferences() {
  const prefs = loadPreferences();
  
  // Font size
  const fontSizes = {
    small: "13px",
    medium: "14px",
    large: "16px",
  };
  document.documentElement.style.setProperty("--font-size-base", fontSizes[prefs.fontSize] || fontSizes.medium);
  
  // Density
  const densities = {
    compact: { padding: "8px", gap: "4px" },
    normal: { padding: "12px", gap: "8px" },
    comfortable: { padding: "16px", gap: "12px" },
  };
  const density = densities[prefs.density] || densities.normal;
  document.documentElement.style.setProperty("--density-padding", density.padding);
  document.documentElement.style.setProperty("--density-gap", density.gap);
  
  // Animations
  if (!prefs.animations) {
    document.documentElement.style.setProperty("--transition-fast", "0s");
    document.documentElement.style.setProperty("--transition-normal", "0s");
    document.documentElement.style.setProperty("--transition-slow", "0s");
  } else {
    document.documentElement.style.setProperty("--transition-fast", "0.15s var(--ease)");
    document.documentElement.style.setProperty("--transition-normal", "0.25s var(--ease)");
    document.documentElement.style.setProperty("--transition-slow", "0.4s var(--ease)");
  }
  
  // Apply density class
  document.body.classList.remove("density-compact", "density-normal", "density-comfortable");
  document.body.classList.add(`density-${prefs.density}`);
  
  // Apply font size class
  document.body.classList.remove("font-small", "font-medium", "font-large");
  document.body.classList.add(`font-${prefs.fontSize}`);
}

// Initialize preferences
export function initPreferences() {
  applyPreferences();
  
  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
      if (e.matches) {
        updatePreference("animations", false);
      }
    });
  }
}

// Create preferences panel HTML
export function createPreferencesPanel() {
  const prefs = loadPreferences();
  
  return `
    <div class="preferences-panel">
      <h3 class="preferences-title">Настройки интерфейса</h3>
      
      <div class="preferences-section">
        <label class="preferences-label">Размер шрифта</label>
        <div class="preferences-options">
          <button class="preferences-option ${prefs.fontSize === 'small' ? 'active' : ''}" data-pref="fontSize" data-value="small">Маленький</button>
          <button class="preferences-option ${prefs.fontSize === 'medium' ? 'active' : ''}" data-pref="fontSize" data-value="medium">Средний</button>
          <button class="preferences-option ${prefs.fontSize === 'large' ? 'active' : ''}" data-pref="fontSize" data-value="large">Большой</button>
        </div>
      </div>
      
      <div class="preferences-section">
        <label class="preferences-label">Плотность интерфейса</label>
        <div class="preferences-options">
          <button class="preferences-option ${prefs.density === 'compact' ? 'active' : ''}" data-pref="density" data-value="compact">Компактная</button>
          <button class="preferences-option ${prefs.density === 'normal' ? 'active' : ''}" data-pref="density" data-value="normal">Обычная</button>
          <button class="preferences-option ${prefs.density === 'comfortable' ? 'active' : ''}" data-pref="density" data-value="comfortable">Комфортная</button>
        </div>
      </div>
      
      <div class="preferences-section">
        <label class="preferences-toggle">
          <input type="checkbox" data-pref="animations" ${prefs.animations ? 'checked' : ''} />
          <span>Анимации</span>
        </label>
      </div>
      
      <div class="preferences-section">
        <label class="preferences-toggle">
          <input type="checkbox" data-pref="soundEffects" ${prefs.soundEffects ? 'checked' : ''} />
          <span>Звуковые эффекты</span>
        </label>
      </div>
      
      <div class="preferences-section">
        <label class="preferences-toggle">
          <input type="checkbox" data-pref="hapticFeedback" ${prefs.hapticFeedback ? 'checked' : ''} />
          <span>Вибрация (мобильные)</span>
        </label>
      </div>
      
      <div class="preferences-section">
        <label class="preferences-toggle">
          <input type="checkbox" data-pref="autoSave" ${prefs.autoSave ? 'checked' : ''} />
          <span>Автосохранение</span>
        </label>
      </div>
      
      <div class="preferences-section">
        <label class="preferences-toggle">
          <input type="checkbox" data-pref="showTutorials" ${prefs.showTutorials ? 'checked' : ''} />
          <span>Показывать подсказки</span>
        </label>
      </div>
      
      <div class="preferences-actions">
        <button class="btn btn-sm" id="resetPreferences">Сбросить настройки</button>
      </div>
    </div>
  `;
}

// Handle preferences panel events
export function initPreferencesPanel(container) {
  if (!container) return;
  
  // Handle option buttons
  container.querySelectorAll('.preferences-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const pref = btn.dataset.pref;
      const value = btn.dataset.value;
      updatePreference(pref, value);
      
      // Update active state
      container.querySelectorAll(`.preferences-option[data-pref="${pref}"]`).forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    });
  });
  
  // Handle toggles
  container.querySelectorAll('.preferences-toggle input').forEach(input => {
    input.addEventListener('change', () => {
      const pref = input.dataset.pref;
      updatePreference(pref, input.checked);
    });
  });
  
  // Handle reset button
  const resetBtn = container.querySelector('#resetPreferences');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetPreferences();
      // Re-render panel
      container.innerHTML = createPreferencesPanel();
      initPreferencesPanel(container);
    });
  }
}
