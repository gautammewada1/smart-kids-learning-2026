import { COLOR_PALETTES, ColorPalette } from '../types';

export function getPalette(key?: string): ColorPalette {
  if (!key) return COLOR_PALETTES.sunshine;
  return COLOR_PALETTES[key] || COLOR_PALETTES.sunshine;
}

/**
 * Apply the selected palette globally to the document documentElement and body.
 * Injects CSS variables so all cards, headers, background, buttons, navigation,
 * progress bars, icons, borders, and text update smoothly and instantly.
 */
export function applyThemeGlobal(paletteKey: string) {
  const palette = getPalette(paletteKey);
  const root = document.documentElement;
  const body = document.body;

  // Set CSS Variables
  root.style.setProperty('--high-bg', palette.colors.highBg);
  root.style.setProperty('--bg-gradient', palette.colors.bgGradient);
  root.style.setProperty('--high-ink', palette.colors.highInk);
  root.style.setProperty('--text-secondary', palette.colors.textSecondary);
  root.style.setProperty('--high-primary', palette.colors.highPrimary);
  root.style.setProperty('--high-secondary', palette.colors.highSecondary);
  root.style.setProperty('--high-accent', palette.colors.highAccent);
  root.style.setProperty('--high-success', palette.colors.highSuccess);
  root.style.setProperty('--card-bg', palette.colors.cardBg);
  root.style.setProperty('--card-border', palette.colors.cardBorder);
  root.style.setProperty('--header-bg', palette.colors.headerBg);
  root.style.setProperty('--nav-bg', palette.colors.navBg);
  root.style.setProperty('--button-bg', palette.colors.buttonBg);
  root.style.setProperty('--button-text', palette.colors.buttonText);
  root.style.setProperty('--shadow-color', palette.colors.shadowColor);
  root.style.setProperty('--progress-bg', palette.colors.progressBg);
  root.style.setProperty('--progress-fill', palette.colors.progressFill);

  // Toggle dark class
  if (palette.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update body background and smooth transitions
  body.style.background = palette.colors.bgGradient;
  body.style.backgroundColor = palette.colors.highBg;
  body.style.color = palette.colors.highInk;
}
