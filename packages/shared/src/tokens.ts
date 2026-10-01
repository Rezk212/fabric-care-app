// Design tokens for Naqa (proposed identity: indigo-dye + linen + frankincense amber).
export const palette = {
  light: {
    bg: '#F6F2EA',
    surface: '#FFFFFF',
    surfaceMuted: '#EDE7DA',
    ink: '#14233A',
    inkMuted: '#55627A',
    line: '#DDD5C4',
    primary: '#2F3FA8',
    primaryInk: '#FFFFFF',
    accent: '#E3A13D',
    success: '#2E8B6E',
    danger: '#C2413B',
  },
  dark: {
    bg: '#0E1626',
    surface: '#16223A',
    surfaceMuted: '#1D2B49',
    ink: '#F2EEE4',
    inkMuted: '#A5B0C6',
    line: '#2B3957',
    primary: '#8E9BFF',
    primaryInk: '#0E1626',
    accent: '#EBB252',
    success: '#5CC5A0',
    danger: '#F0817B',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Palette = { [K in keyof typeof palette.light]: string };

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;

// One family covers Arabic and Latin so both languages share rhythm.
export const fontFamily = 'IBM Plex Sans Arabic';
export const fontWeights = { regular: '400', medium: '500', semibold: '600', bold: '700' } as const;
export const typeScale = {
  caption: 13,
  body: 16,
  title: 20,
  heading: 28,
  display: 40,
} as const;
