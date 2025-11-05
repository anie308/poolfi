import { createClient } from '@supabase/supabase-js'
import type { CreateWaitlistUser, WaitlistUser } from './database'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and ANON key must be set')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Waitlist service using Supabase
export const waitlistService = {
  async addUser(userData: CreateWaitlistUser & {
    ipAddress?: string
    userAgent?: string
  }): Promise<WaitlistUser> {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        country: userData.country || null,
        ip_address: userData.ipAddress || null,
        user_agent: userData.userAgent || null,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      country: data.country,
      ipAddress: data.ip_address ?? null,
      userAgent: data.user_agent ?? null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  async getUserByEmail(email: string): Promise<WaitlistUser | null> {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      country: data.country,
      ipAddress: data.ip_address ?? null,
      userAgent: data.user_agent ?? null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },

  async getAllUsers(): Promise<WaitlistUser[]> {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data ?? []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      country: row.country,
      ipAddress: row.ip_address ?? null,
      userAgent: row.user_agent ?? null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  },

  async getUserCount(): Promise<number> {
    const supabase = getSupabase()
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count ?? 0
  },

  async getRecentUsers(limit: number = 10): Promise<WaitlistUser[]> {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data ?? []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      country: row.country,
      ipAddress: row.ip_address ?? null,
      userAgent: row.user_agent ?? null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  }
}

