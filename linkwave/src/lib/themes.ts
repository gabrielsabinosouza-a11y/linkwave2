import type { ThemeConfig, ThemePreset } from '@/types'

export const defaultTheme: ThemeConfig = {
  preset: 'default',
  background: { type: 'gradient', value: 'linear-gradient(160deg,#a8edcf,#78d4f0,#4ab8f5)' },
  typography: { font: 'Nunito', size: 'md', weight: '600', align: 'center', color: '#1a3a5c' },
  buttons: { style: 'glass', radius: '999px', shadow: '0 4px 16px rgba(0,0,0,0.1)', color: 'rgba(255,255,255,0.4)', textColor: '#1a3a5c' },
  layout: { type: 'centered', maxWidth: '480px' },
}

export const themePresets: Record<ThemePreset, ThemeConfig> = {
  default: defaultTheme,
  apple: {
    preset: 'apple',
    background: { type: 'solid', value: '#f5f5f7' },
    typography: { font: 'Inter', size: 'md', weight: '500', align: 'center', color: '#1d1d1f' },
    buttons: { style: 'ios', radius: '14px', shadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#ffffff', textColor: '#1d1d1f' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  aero: {
    preset: 'aero',
    background: { type: 'gradient', value: 'linear-gradient(160deg,#a8edcf,#78d4f0,#4ab8f5)' },
    typography: { font: 'Nunito', size: 'md', weight: '700', align: 'center', color: '#1a6a9a' },
    buttons: { style: 'glass', radius: '999px', shadow: '0 8px 32px rgba(80,180,220,0.3)', color: 'rgba(255,255,255,0.45)', textColor: '#1a6a9a' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  vaporwave: {
    preset: 'vaporwave',
    background: { type: 'gradient', value: 'linear-gradient(135deg,#ff71ce,#b967ff,#01cdfe)' },
    typography: { font: 'Space Grotesk', size: 'md', weight: '700', align: 'center', color: '#ffffff' },
    buttons: { style: 'neon', radius: '4px', shadow: '0 0 20px rgba(185,103,255,0.6)', color: 'rgba(255,255,255,0.1)', textColor: '#ffffff' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  glass: {
    preset: 'glass',
    background: { type: 'gradient', value: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' },
    typography: { font: 'Inter', size: 'md', weight: '500', align: 'center', color: '#ffffff' },
    buttons: { style: 'glass', radius: '16px', shadow: '0 8px 32px rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.1)', textColor: '#ffffff' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  cyberpunk: {
    preset: 'cyberpunk',
    background: { type: 'solid', value: '#0d0d0d' },
    typography: { font: 'Orbitron', size: 'md', weight: '700', align: 'center', color: '#00ff9f' },
    buttons: { style: 'neon', radius: '0px', shadow: '0 0 20px rgba(0,255,159,0.5)', color: '#0d0d0d', textColor: '#00ff9f' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  neon: {
    preset: 'neon',
    background: { type: 'solid', value: '#0a0a0a' },
    typography: { font: 'Rajdhani', size: 'md', weight: '600', align: 'center', color: '#ff007a' },
    buttons: { style: 'neon', radius: '8px', shadow: '0 0 30px rgba(255,0,122,0.5)', color: 'transparent', textColor: '#ff007a' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  retro: {
    preset: 'retro',
    background: { type: 'solid', value: '#fef3c7' },
    typography: { font: 'VT323', size: 'lg', weight: '400', align: 'center', color: '#92400e' },
    buttons: { style: 'brutalist', radius: '0px', shadow: '4px 4px 0 #92400e', color: '#fbbf24', textColor: '#92400e' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  minimal: {
    preset: 'minimal',
    background: { type: 'solid', value: '#ffffff' },
    typography: { font: 'Inter', size: 'md', weight: '400', align: 'center', color: '#111111' },
    buttons: { style: 'minimal', radius: '8px', shadow: 'none', color: '#f4f4f5', textColor: '#111111' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  dark: {
    preset: 'dark',
    background: { type: 'solid', value: '#09090b' },
    typography: { font: 'Inter', size: 'md', weight: '500', align: 'center', color: '#fafafa' },
    buttons: { style: 'minimal', radius: '12px', shadow: '0 2px 8px rgba(0,0,0,0.4)', color: '#27272a', textColor: '#fafafa' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  nature: {
    preset: 'nature',
    background: { type: 'gradient', value: 'linear-gradient(160deg,#d4f5e2,#a8e6c0,#6dc98a)' },
    typography: { font: 'Nunito', size: 'md', weight: '600', align: 'center', color: '#14532d' },
    buttons: { style: 'glass', radius: '999px', shadow: '0 4px 16px rgba(20,83,45,0.2)', color: 'rgba(255,255,255,0.5)', textColor: '#14532d' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  gradient: {
    preset: 'gradient',
    background: { type: 'gradient', value: 'linear-gradient(135deg,#667eea,#764ba2)' },
    typography: { font: 'Poppins', size: 'md', weight: '600', align: 'center', color: '#ffffff' },
    buttons: { style: 'glass', radius: '999px', shadow: '0 4px 20px rgba(102,126,234,0.4)', color: 'rgba(255,255,255,0.2)', textColor: '#ffffff' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
  gaming: {
    preset: 'gaming',
    background: { type: 'gradient', value: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' },
    typography: { font: 'Rajdhani', size: 'md', weight: '700', align: 'center', color: '#e879f9' },
    buttons: { style: 'neon', radius: '6px', shadow: '0 0 24px rgba(232,121,249,0.4)', color: 'rgba(232,121,249,0.1)', textColor: '#e879f9' },
    layout: { type: 'centered', maxWidth: '480px' },
  },
}
