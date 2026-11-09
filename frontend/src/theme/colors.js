/**
 * Brand color tokens
 * Mirror the CSS custom properties in theme.css for JS-side usage
 */

export const colors = {
  primary: {
    DEFAULT: '#6C63FF',
    light: '#8B85FF',
    dark: '#4A42DB',
  },
  secondary: {
    DEFAULT: '#00D9A6',
    light: '#33E4BC',
    dark: '#00B88A',
  },
  accent: {
    DEFAULT: '#FF6B6B',
    light: '#FF9494',
    dark: '#E04848',
  },
  bg: {
    primary: '#0F0F1A',
    secondary: '#1A1A2E',
    tertiary: '#252542',
    card: '#1E1E36',
    elevated: '#2A2A4A',
  },
  surface: '#16162B',
  border: {
    DEFAULT: '#2E2E52',
    light: '#3D3D6B',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0C0',
    muted: '#6B6B8D',
    inverse: '#0F0F1A',
  },
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.DEFAULT}, ${colors.secondary.DEFAULT})`,
  accent: `linear-gradient(135deg, ${colors.accent.DEFAULT}, ${colors.primary.DEFAULT})`,
  dark: `linear-gradient(180deg, ${colors.bg.primary}, ${colors.bg.secondary})`,
};
