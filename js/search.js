// js/search.js — Global search functionality
import { esc } from './utils.js';

const LS_SEARCH_HISTORY = "search.history.v1";
const MAX_HISTORY = 10;

// Search data sources
const searchData = {
  recipes: { label: "Рецепты", icon: "📋", route: "recipes" },
  calculator: { label: "Калькулятор", icon: "🚬", route: "calculator" },
  affixes: { label: "Аффиксы", icon: "✨", route: "affixes" },
  baryga: { label: "Барыга", icon: "🏪", route: "baryga" },
  bosses: { label: "Боссы", icon: "👹", route: "bosses" },
  minions: { label: "Шестёрки", icon: "👥", route: "minions" },
  sets: { label: "Сеты", icon: "👕", route: "sets" },
  effects: { label: "Эффекты", icon: "⚔️", route: "effects" },
  safe: { label: "Сейф", icon: "🔒", route: "safe" },
};

// Load search history
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(LS_SEARCH_HISTORY) || "[]");
  } catch {
    return [];
  }
}

// Save search history
function saveHistory(history) {
  localStorage.setItem(LS_SEARCH_HISTORY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

// Add to search history
function addToHistory(query) {
  if (!query.trim()) return;
  const history = loadHistory();
  const filtered = history.filter(h => h.toLowerCase() !== query.toLowerCase());
  filtered.unshift(query.trim());
  saveHistory(filtered);
}

// Clear search history
function clearHistory() {
  localStorage.removeItem(LS_SEARCH_HISTORY);
}

// Normalize search string
function normalizeSearch(str) {
  return String(str || "").toLowerCase().trim();
}

// Search across all data
function searchAll(query) {
  const q = normalizeSearch(query);
  if (!q) return [];

  const results = [];

  // Search in page names
  Object.entries(searchData).forEach(([key, data]) => {
    if (normalizeSearch(data.label).includes(q)) {
      results.push({
        type: "page",
        id: key,
        name: data.label,
        icon: data.icon,
        route: data.route,
        category: "Страница",
      });
    }
  });

  return results;
}

// Render search results
function renderResults(results, query) {
  if (!results.length) {
    return `<div class="search-no-results">Ничего не найдено для "${esc(query)}"</div>`;
  }

  return results.map(r => `
    <div class="search-result-item" data-route="${esc(r.route)}" data-id="${esc(r.id)}">
      <div class="search-result-icon">${r.icon}</div>
      <div class="search-result-info">
        <div class="search-result-name">${esc(r.name)}</div>
        ${r.desc ? `<div class="search-result-desc">${esc(r.desc)}</div>` : ''}
      </div>
      <span class="search-result-category">${esc(r.category)}</span>
    </div>
  `).join('');
}

// Render search history
function renderHistory() {
  const history = loadHistory();
  if (!history.length) return '';

  return `
    <div class="search-history">
      <div class="search-history-header">
        <span>История поиска</span>
        <button class="search-history-clear" id="clearSearchHistory" type="button">Очистить</button>
      </div>
      ${history.map(h => `
        <div class="search-history-item" data-query="${esc(h)}">
          <span class="search-history-icon">🕐</span>
          <span class="search-history-text">${esc(h)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Initialize global search
export function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  const searchClear = document.getElementById('globalSearchClear');
  const searchResults = document.getElementById('globalSearchResults');
  const mobileSearchInput = document.getElementById('globalSearchMobile');
  const mobileSearchClear = document.getElementById('globalSearchClearMobile');

  if (!searchInput || !searchResults) return;

  let debounceTimer = null;

  // Show/hide clear button
  function updateClearButton(input, clearBtn) {
    if (clearBtn) {
      clearBtn.classList.toggle('visible', !!input.value);
    }
  }

  // Perform search
  function performSearch(query) {
    const q = normalizeSearch(query);
    
    if (!q) {
      // Show history when empty
      searchResults.innerHTML = renderHistory();
      searchResults.classList.remove('hidden');
      return;
    }

    const results = searchAll(q);
    searchResults.innerHTML = renderResults(results, q);
    searchResults.classList.remove('hidden');
  }

  // Handle input
  searchInput.addEventListener('input', () => {
    updateClearButton(searchInput, searchClear);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(searchInput.value);
    }, 150);
  });

  // Handle focus - show history
  searchInput.addEventListener('focus', () => {
    if (!searchInput.value) {
      searchResults.innerHTML = renderHistory();
      searchResults.classList.remove('hidden');
    }
  });

  // Handle clear
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      updateClearButton(searchInput, searchClear);
      searchResults.innerHTML = renderHistory();
      searchInput.focus();
    });
  }

  // Handle result click
  searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (item) {
      const route = item.dataset.route;
      const query = searchInput.value;
      if (query) addToHistory(query);
      searchInput.value = '';
      updateClearButton(searchInput, searchClear);
      searchResults.classList.add('hidden');
      // Navigate to route
      window.location.hash = route;
    }

    // Handle history item click
    const historyItem = e.target.closest('.search-history-item');
    if (historyItem) {
      const query = historyItem.dataset.query;
      searchInput.value = query;
      updateClearButton(searchInput, searchClear);
      performSearch(query);
    }

    // Handle clear history
    if (e.target.id === 'clearSearchHistory') {
      clearHistory();
      searchResults.innerHTML = renderHistory();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchResults.classList.add('hidden');
      searchInput.blur();
    }
  });

  // Mobile search
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', () => {
      updateClearButton(mobileSearchInput, mobileSearchClear);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = normalizeSearch(mobileSearchInput.value);
        if (q) {
          const results = searchAll(q);
          if (results.length > 0) {
            const route = results[0].route;
            if (mobileSearchInput.value) addToHistory(mobileSearchInput.value);
            mobileSearchInput.value = '';
            updateClearButton(mobileSearchInput, mobileSearchClear);
            window.location.hash = route;
          }
        }
      }, 300);
    });

    if (mobileSearchClear) {
      mobileSearchClear.addEventListener('click', () => {
        mobileSearchInput.value = '';
        updateClearButton(mobileSearchInput, mobileSearchClear);
      });
    }
  }
}
