export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          credits: number
          created_at: string
        }
        Insert: {
          id: string
          credits?: number
          created_at?: string
        }
        Update: {
          id?: string
          credits?: number
          created_at?: string
        }
        Relationships: any[]
      }
      resources: {
        Row: {
          id: string
          title: string
          slug: string
          category: '3D' | '2D' | 'PNG'
          price_credits: number
          preview_url: string | null
          download_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: '3D' | '2D' | 'PNG'
          price_credits?: number
          preview_url?: string | null
          download_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: '3D' | '2D' | 'PNG'
          price_credits?: number
          preview_url?: string | null
          download_url?: string | null
          created_at?: string
        }
        Relationships: any[]
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          thumbnail: string | null
          meta_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          thumbnail?: string | null
          meta_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          thumbnail?: string | null
          meta_description?: string | null
          created_at?: string
        }
        Relationships: any[]
      }
      transactions: {
        Row: {
          id: string
          profile_id: string
          resource_id: string | null
          amount: number
          type: 'purchase' | 'topup'
          status: 'pending' | 'completed' | 'failed'
          reference_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          resource_id?: string | null
          amount: number
          type: 'purchase' | 'topup'
          status?: 'pending' | 'completed' | 'failed'
          reference_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          resource_id?: string | null
          amount?: number
          type?: 'purchase' | 'topup'
          status?: 'pending' | 'completed' | 'failed'
          reference_code?: string | null
          created_at?: string
        }
        Relationships: any[]
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      resource_category: '3D' | '2D' | 'PNG'
      transaction_type: 'purchase' | 'topup'
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}
