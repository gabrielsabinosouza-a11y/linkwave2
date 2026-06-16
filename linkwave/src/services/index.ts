import { createClient } from '@/lib/supabase/client'
import type { Profile, Link } from '@/types'

const supabase = createClient()

export const profileService = {
  async getByUsername(username: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
    if (error) throw error
    return data as Profile
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return data as Profile
  },

  async update(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Profile
  },

  async checkUsernameAvailable(username: string) {
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('username', username)
    return count === 0
  },
}

export const linkService = {
  async getByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', profileId)
      .order('order_index')
    if (error) throw error
    return data as Link[]
  },

  async create(link: Omit<Link, 'id' | 'clicks' | 'created_at'>) {
    const { data, error } = await supabase.from('links').insert(link).select().single()
    if (error) throw error
    return data as Link
  },

  async update(id: string, updates: Partial<Link>) {
    const { data, error } = await supabase
      .from('links')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Link
  },

  async delete(id: string) {
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) throw error
  },

  async reorder(updates: { id: string; order_index: number }[]) {
    const promises = updates.map(({ id, order_index }) =>
      supabase.from('links').update({ order_index }).eq('id', id),
    )
    await Promise.all(promises)
  },

  async recordClick(linkId: string, profileId: string, meta: { country?: string; device?: string; browser?: string; referrer?: string }) {
    await supabase.from('click_events').insert({
      link_id: linkId,
      profile_id: profileId,
      ...meta,
    })
    await supabase.rpc('increment_link_clicks', { link_id: linkId })
  },
}

export const analyticsService = {
  async getStats(profileId: string) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profileId)
      .single()
    if (error) throw error
    return data
  },

  async getClickEvents(profileId: string, days = 30) {
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
      .from('click_events')
      .select('*')
      .eq('profile_id', profileId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async recordView(profileId: string) {
    await supabase.rpc('increment_profile_views', { profile_id: profileId })
  },
}
