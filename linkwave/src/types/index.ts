export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  location: string | null
  profession: string | null
  website: string | null
  verified: boolean
  is_public: boolean
  theme_config: ThemeConfig
  seo_config: SeoConfig
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  profile_id: string
  title: string
  url: string
  icon: string | null
  order_index: number
  is_active: boolean
  clicks: number
  created_at: string
}

export interface Block {
  id: string
  profile_id: string
  type: BlockType
  content: Record<string, unknown>
  order_index: number
  is_active: boolean
  created_at: string
}

export type BlockType =
  | 'button'
  | 'image'
  | 'video'
  | 'text'
  | 'markdown'
  | 'divider'
  | 'social'
  | 'embed'
  | 'music'
  | 'gallery'
  | 'faq'
  | 'map'
  | 'newsletter'
  | 'donation'

export interface ThemeConfig {
  preset: string
  background: BackgroundConfig
  typography: TypographyConfig
  buttons: ButtonConfig
  layout: LayoutConfig
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image' | 'video' | 'animated'
  value: string
  overlay?: string
}

export interface TypographyConfig {
  font: string
  size: 'sm' | 'md' | 'lg'
  weight: string
  align: 'left' | 'center' | 'right'
  color: string
}

export interface ButtonConfig {
  style: 'glass' | 'neon' | 'minimal' | 'brutalist' | 'ios' | 'material'
  radius: string
  shadow: string
  color: string
  textColor: string
}

export interface LayoutConfig {
  type: 'centered' | 'left' | 'right' | 'grid' | 'masonry'
  maxWidth: string
}

export interface SeoConfig {
  title: string | null
  description: string | null
  og_image: string | null
}

export interface Analytics {
  profile_id: string
  total_views: number
  total_clicks: number
  views_today: number
  clicks_today: number
}

export interface ClickEvent {
  id: string
  link_id: string
  profile_id: string
  country: string | null
  device: string | null
  browser: string | null
  referrer: string | null
  created_at: string
}

export const THEME_PRESETS = [
  'default',
  'apple',
  'aero',
  'vaporwave',
  'glass',
  'cyberpunk',
  'neon',
  'retro',
  'minimal',
  'dark',
  'nature',
  'gradient',
  'gaming',
] as const

export type ThemePreset = (typeof THEME_PRESETS)[number]
