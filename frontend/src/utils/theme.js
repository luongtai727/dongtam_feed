// Helper to convert hex to rgb
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper to lighten/darken rgb color
export function adjustColorBrightness(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  let r = Math.round(rgb.r * (1 + percent / 100));
  let g = Math.round(rgb.g * (1 + percent / 100));
  let b = Math.round(rgb.b * (1 + percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function applyCustomThemeColor(hexColor, name, prefix) {
  if (!hexColor) return;
  const root = document.documentElement;

  // Set the primary/secondary names
  root.style.setProperty(`--${name}`, hexColor);
  root.style.setProperty(`--${name}-light`, adjustColorBrightness(hexColor, 30));
  root.style.setProperty(`--${name}-dark`, adjustColorBrightness(hexColor, -20));

  // Set the shades
  if (prefix === 'green') {
    root.style.setProperty('--green-600', hexColor);
    root.style.setProperty('--green-700', adjustColorBrightness(hexColor, -15));
    root.style.setProperty('--green-800', adjustColorBrightness(hexColor, -30));
    root.style.setProperty('--green-900', adjustColorBrightness(hexColor, -45));
    root.style.setProperty('--green-500', adjustColorBrightness(hexColor, 15));
    root.style.setProperty('--green-400', adjustColorBrightness(hexColor, 30));
    root.style.setProperty('--green-300', adjustColorBrightness(hexColor, 45));
    root.style.setProperty('--green-200', adjustColorBrightness(hexColor, 60));
    root.style.setProperty('--green-100', adjustColorBrightness(hexColor, 75));
    root.style.setProperty('--green-50', adjustColorBrightness(hexColor, 90));
  } else if (prefix === 'navy') {
    root.style.setProperty('--navy-800', hexColor);
    root.style.setProperty('--navy-900', adjustColorBrightness(hexColor, -20));
    root.style.setProperty('--navy-700', adjustColorBrightness(hexColor, 15));
    root.style.setProperty('--navy-600', adjustColorBrightness(hexColor, 30));
    root.style.setProperty('--navy-500', adjustColorBrightness(hexColor, 45));
    root.style.setProperty('--navy-400', adjustColorBrightness(hexColor, 60));
    root.style.setProperty('--navy-300', adjustColorBrightness(hexColor, 70));
    root.style.setProperty('--navy-200', adjustColorBrightness(hexColor, 80));
    root.style.setProperty('--navy-100', adjustColorBrightness(hexColor, 85));
    root.style.setProperty('--navy-50', adjustColorBrightness(hexColor, 92));
  }
}
