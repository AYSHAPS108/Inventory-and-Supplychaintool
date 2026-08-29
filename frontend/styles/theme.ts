import { ThemeMode } from '../types';

export const getThemeColors = (mode: ThemeMode) => {
  const isDark = mode === 'dark';

  return {
    isDark,
    brandPrimary: '#123FA8',
    brandAccent: '#165DFF',
    brandDark: '#071A4D',

    bgPrimary: isDark ? '#050505' : '#f4f6fa',
    bgSecondary: isDark ? '#0d1117' : '#ffffff',
    bgCard: isDark ? '#0d1117' : '#ffffff',
    bgCardHover: isDark ? 'rgba(22, 93, 255, 0.08)' : 'rgba(18, 63, 168, 0.04)',
    bgInput: isDark ? '#0a0e14' : '#f8f9fc',
    bgSidebar: isDark ? '#070b12' : '#ffffff',
    bgHeader: isDark ? '#070b12' : '#ffffff',

    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(18, 63, 168, 0.12)',
    borderFocus: '#165DFF',

    textMain: isDark ? '#f0f4ff' : '#071A4D',
    textMuted: isDark ? '#8b99b5' : '#4b5e8a',
    textSubtle: isDark ? '#4b5675' : '#8e9fc0',
    textInverse: isDark ? '#050505' : '#ffffff',

    statusSuccess: isDark ? '#10b981' : '#059669',
    statusSuccessBg: isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(5, 150, 105, 0.12)',
    statusWarning: isDark ? '#f59e0b' : '#d97706',
    statusWarningBg: isDark ? 'rgba(245, 158, 11, 0.14)' : 'rgba(217, 119, 6, 0.12)',
    statusDanger: isDark ? '#ef4444' : '#dc2626',
    statusDangerBg: isDark ? 'rgba(239, 68, 68, 0.14)' : 'rgba(220, 38, 38, 0.12)',
    statusInfo: '#3b82f6',
    statusInfoBg: 'rgba(59, 130, 246, 0.14)',

    shadowSm: {
      elevation: 2,
    },
    shadowMd: {
      elevation: 4,
    }
  };
};
