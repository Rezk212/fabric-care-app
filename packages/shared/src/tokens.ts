// Design tokens for Naqa. Direction: rinse-water indigo on cool white, one amber highlight.
export const palette = {
  light: {
    bg: '#F3F6FB',
    surface: '#FFFFFF',
    surfaceMuted: '#E8EDF7',
    ink: '#0E1A33',
    inkMuted: '#5B6783',
    line: '#DCE3F0',
    primary: '#3347D6',
    primaryInk: '#FFFFFF',
    primarySoft: '#E4E8FD',
    heroFrom: '#4257E8',
    heroTo: '#1B2A8F',
    onHero: '#FFFFFF',
    onHeroMuted: 'rgba(255,255,255,0.82)',
    accent: '#F2A93B',
    accentText: '#8A5A00', // accent as text: 5.9:1 on surface (raw accent is decoration only)
    accentSoft: '#FDF0D9',
    success: '#1F8A66',
    successText: '#176B50',
    successSoft: '#DDF3EA',
    danger: '#C23A3A',
    shadow: '#0E1A33',
  },
  dark: {
    bg: '#0A1022',
    surface: '#131C36',
    surfaceMuted: '#1B2646',
    ink: '#EEF1FA',
    inkMuted: '#9DA9C8',
    line: '#26325A',
    primary: '#8C9CFF',
    primaryInk: '#0A1022',
    primarySoft: '#232E63',
    heroFrom: '#2F43CC',
    heroTo: '#0F1A5C',
    onHero: '#FFFFFF',
    onHeroMuted: 'rgba(255,255,255,0.82)',
    accent: '#F3B550',
    accentText: '#F3B550',
    accentSoft: '#3A2F17',
    success: '#5CC9A2',
    successText: '#5CC9A2',
    successSoft: '#143A2E',
    danger: '#F28B8B',
    shadow: '#000000',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Palette = { [K in keyof typeof palette.light]: string };

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 } as const;

// One family covers Arabic and Latin so both languages share rhythm and weight.
export const fontFamily = 'Readex Pro';
export const fontWeights = { regular: '400', medium: '500', semibold: '600', bold: '700' } as const;
export const typeScale = {
  caption: 13,
  body: 16,
  title: 20,
  heading: 28,
  display: 38,
} as const;
