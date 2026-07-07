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

export function applyCustomTheme(settings) {
  if (!settings) return;
  
  let styleTag = document.getElementById('dynamic-theme-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme-styles';
    document.head.appendChild(styleTag);
  }

  const primaryLight = settings.themeColorGreen || '#1e7d52';
  const secondaryLight = settings.themeColorNavy || '#21354d';
  const textLight = settings.textColorLight || '#272d37';
  const textDark = settings.textColorDark || '#dce2e8';

  const primaryDark = adjustColorBrightness(primaryLight, 15); // Lighter shade for dark mode visibility

  const css = `
    :root {
      --primary: ${primaryLight};
      --primary-light: ${adjustColorBrightness(primaryLight, 30)};
      --primary-dark: ${adjustColorBrightness(primaryLight, -20)};
      --secondary: ${secondaryLight};
      --secondary-light: ${adjustColorBrightness(secondaryLight, 30)};
      --secondary-dark: ${adjustColorBrightness(secondaryLight, -20)};
      
      --green-600: ${primaryLight};
      --green-700: ${adjustColorBrightness(primaryLight, -15)};
      --green-800: ${adjustColorBrightness(primaryLight, -30)};
      --green-900: ${adjustColorBrightness(primaryLight, -45)};
      --green-500: ${adjustColorBrightness(primaryLight, 15)};
      --green-400: ${adjustColorBrightness(primaryLight, 30)};
      --green-300: ${adjustColorBrightness(primaryLight, 45)};
      --green-200: ${adjustColorBrightness(primaryLight, 60)};
      --green-100: ${adjustColorBrightness(primaryLight, 75)};
      --green-50: ${adjustColorBrightness(primaryLight, 90)};

      --navy-800: ${secondaryLight};
      --navy-900: ${adjustColorBrightness(secondaryLight, -20)};
      --navy-700: ${adjustColorBrightness(secondaryLight, 15)};
      --navy-600: ${adjustColorBrightness(secondaryLight, 30)};
      --navy-500: ${adjustColorBrightness(secondaryLight, 45)};
      --navy-400: ${adjustColorBrightness(secondaryLight, 60)};
      --navy-300: ${adjustColorBrightness(secondaryLight, 70)};
      --navy-200: ${adjustColorBrightness(secondaryLight, 80)};
      --navy-100: ${adjustColorBrightness(secondaryLight, 85)};
      --navy-50: ${adjustColorBrightness(secondaryLight, 92)};

      --text-primary: ${textLight};
      --text-secondary: ${adjustColorBrightness(textLight, 30)};
      --text-muted: ${adjustColorBrightness(textLight, 50)};
      --text-heading: ${adjustColorBrightness(textLight, -15)};
    }

    [data-theme="dark"] {
      --primary: ${primaryDark};
      --primary-light: ${adjustColorBrightness(primaryDark, 30)};
      --primary-dark: ${adjustColorBrightness(primaryDark, -20)};

      --green-600: ${primaryDark};
      --green-700: ${adjustColorBrightness(primaryDark, -15)};
      --green-800: ${adjustColorBrightness(primaryDark, -30)};
      --green-900: ${adjustColorBrightness(primaryDark, -45)};
      --green-500: ${adjustColorBrightness(primaryDark, 15)};
      --green-400: ${adjustColorBrightness(primaryDark, 30)};
      --green-300: ${adjustColorBrightness(primaryDark, 45)};
      --green-200: ${adjustColorBrightness(primaryDark, 60)};
      --green-100: ${adjustColorBrightness(primaryDark, 75)};
      --green-50: ${adjustColorBrightness(primaryDark, 90)};

      --text-primary: ${textDark};
      --text-secondary: ${adjustColorBrightness(textDark, -15)};
      --text-muted: ${adjustColorBrightness(textDark, -30)};
      --text-heading: ${adjustColorBrightness(textDark, 10)};
    }
  `;
  styleTag.innerHTML = css;
}
