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
          role: 'USER' | 'ADMIN' | 'EDITOR'
          created_at: string
        }
        Insert: {
          id: string
          credits?: number
          role?: 'USER' | 'ADMIN' | 'EDITOR'
          created_at?: string
        }
        Update: {
          id?: string
          credits?: number
          role?: 'USER' | 'ADMIN' | 'EDITOR'
          created_at?: string
        }
        Relationships: never[]
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
        Relationships: never[]
      }
      hero_slides: {
        Row: {
          id: string
          image_url: string
          alt_text: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: never[]
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
        Relationships: never[]
      }
      transactions: {
        Row: {
          id: string
          profile_id: string
          resource_id: string | null
          amount: number
          type: 'purchase' | 'topup'
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          reference_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          resource_id?: string | null
          amount: number
          type: 'purchase' | 'topup'
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          reference_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          resource_id?: string | null
          amount?: number
          type?: 'purchase' | 'topup'
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          reference_code?: string | null
          created_at?: string
        }
        Relationships: never[]
      }
    }
    Views: {
      admin_user_view: {
        Row: {
          id: string
          email: string
          credits: number
          role: 'USER' | 'ADMIN' | 'EDITOR'
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: never[]
      }
    }
    Functions: {
      increment_credits: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: void
      }
    }
    Enums: {
      resource_category: '3D' | '2D' | 'PNG'
      transaction_type: 'purchase' | 'topup'
      transaction_status: 'pending' | 'completed' | 'failed' | 'cancelled'
      user_role: 'USER' | 'ADMIN' | 'EDITOR'
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}
