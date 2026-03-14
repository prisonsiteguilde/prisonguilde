// js/theme-scheduler.js — Automatic theme switching based on time

const LS_SCHEDULE_ENABLED = "theme.schedule.enabled";
const LS_SCHEDULE_CONFIG = "theme.schedule.config";

// Default schedule configuration
const DEFAULT_CONFIG = {
  darkStart: 20, // 8 PM
  darkEnd: 7,    // 7 AM
  lightTheme: "theme-light",
  darkTheme: "theme-dark",
};

// Load schedule enabled state
function loadScheduleEnabled() {
  try {
    return JSON.parse(localStorage.getItem(LS_SCHEDULE_ENABLED) || "false");
  } catch {
    return false;
  }
}

// Save schedule enabled state
function saveScheduleEnabled(enabled) {
  localStorage.setItem(LS_SCHEDULE_ENABLED, JSON.stringify(enabled));
}

// Load schedule configuration
function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(LS_SCHEDULE_CONFIG) || "null") || DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

// Save schedule configuration
function saveConfig(config) {
  localStorage.setItem(LS_SCHEDULE_CONFIG, JSON.stringify(config));
}

// Check if current time is in dark period
function isDarkTime(config = loadConfig()) {
  const hour = new Date().getHours();
  const { darkStart, darkEnd } = config;
  
  if (darkStart > darkEnd) {
    // Dark period crosses midnight (e.g., 20:00 - 07:00)
    return hour >= darkStart || hour < darkEnd;
  } else {
    // Dark period within same day (e.g., 22:00 - 06:00)
    return hour >= darkStart && hour < darkEnd;
  }
}

// Get theme for current time
function getThemeForTime(config = loadConfig()) {
  return isDarkTime(config) ? config.darkTheme : config.lightTheme;
}

// Apply theme based on schedule
export function applyScheduledTheme() {
  if (!loadScheduleEnabled()) return false;
  
  const theme = getThemeForTime();
  const currentTheme = localStorage.getItem("theme");
  
  if (currentTheme !== theme) {
    localStorage.setItem("theme", theme);
    return true; // Theme changed
  }
  
  return false; // No change needed
}

// Check if schedule is enabled
export function isScheduleEnabled() {
  return loadScheduleEnabled();
}

// Enable/disable schedule
export function setScheduleEnabled(enabled) {
  saveScheduleEnabled(enabled);
  return enabled;
}

// Get schedule configuration
export function getScheduleConfig() {
  return loadConfig();
}

// Update schedule configuration
export function updateScheduleConfig(config) {
  const currentConfig = loadConfig();
  const newConfig = { ...currentConfig, ...config };
  saveConfig(newConfig);
  return newConfig;
}

// Get next theme change time
export function getNextThemeChange() {
  const config = loadConfig();
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  let nextChange;
  
  if (isDarkTime(config)) {
    // Currently dark, next change is to light
    if (hour < config.darkEnd) {
      // Before end time today
      nextChange = new Date(now);
      nextChange.setHours(config.darkEnd, 0, 0, 0);
    } else {
      // After end time, next change is tomorrow
      nextChange = new Date(now);
      nextChange.setDate(nextChange.getDate() + 1);
      nextChange.setHours(config.darkEnd, 0, 0, 0);
    }
  } else {
    // Currently light, next change is to dark
    if (hour < config.darkStart) {
      // Before start time today
      nextChange = new Date(now);
      nextChange.setHours(config.darkStart, 0, 0, 0);
    } else {
      // After start time, next change is tomorrow
      nextChange = new Date(now);
      nextChange.setDate(nextChange.getDate() + 1);
      nextChange.setHours(config.darkStart, 0, 0, 0);
    }
  }
  
  return nextChange;
}

// Format time until next change
export function formatTimeUntilNextChange() {
  const nextChange = getNextThemeChange();
  const now = new Date();
  const diff = nextChange - now;
  
  if (diff <= 0) return "сейчас";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  } else {
    return `${minutes}м`;
  }
}

// Initialize theme scheduler
export function initThemeScheduler() {
  // Check and apply theme on load
  const changed = applyScheduledTheme();
  
  // Set up interval to check every minute
  setInterval(() => {
    const changed = applyScheduledTheme();
    if (changed) {
      // Reload page to apply theme
      window.location.reload();
    }
  }, 60000); // Check every minute
  
  return changed;
}
