import { create } from 'zustand'
import type { Profile, Link, Block, ThemeConfig } from '@/types'
import { defaultTheme } from '@/lib/themes'

interface ProfileStore {
  profile: Profile | null
  links: Link[]
  blocks: Block[]
  theme: ThemeConfig
  setProfile: (p: Profile) => void
  setLinks: (l: Link[]) => void
  setBlocks: (b: Block[]) => void
  setTheme: (t: ThemeConfig) => void
  updateLink: (id: string, data: Partial<Link>) => void
  removeLink: (id: string) => void
  addLink: (link: Link) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  links: [],
  blocks: [],
  theme: defaultTheme,
  setProfile: (profile) => set({ profile, theme: profile.theme_config ?? defaultTheme }),
  setLinks: (links) => set({ links }),
  setBlocks: (blocks) => set({ blocks }),
  setTheme: (theme) => set({ theme }),
  addLink: (link) => set((s) => ({ links: [...s.links, link] })),
  updateLink: (id, data) =>
    set((s) => ({ links: s.links.map((l) => (l.id === id ? { ...l, ...data } : l)) })),
  removeLink: (id) => set((s) => ({ links: s.links.filter((l) => l.id !== id) })),
}))
