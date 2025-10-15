// Optimierte Json-Typen für bessere Serialisierung
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Aufgeteilte Typen für bessere Performance
export type DatabaseUser = {
  id: string
  email: string
  name: string | null
  credits: number
  plan: string
  created_at: string
  updated_at: string
}

export type DatabaseProject = {
  id: string
  user_id: string
  name: string
  domain: string
  created_at: string
  updated_at: string
}

export type DatabaseAnalysis = {
  id: string
  project_id: string | null
  user_id: string
  type: string
  input: Json
  task_id: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result: Json | null
  credits_used: number
  created_at: string
  updated_at: string
}

export type DatabaseRankTracking = {
  id: string
  project_id: string
  keyword: string
  position: number | null
  volume: number | null
  trend: Json | null
  checked_at: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          credits: number
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          credits?: number
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          credits?: number
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          domain: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          domain: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      analyses: {
        Row: {
          id: string
          project_id: string | null
          user_id: string
          type: string
          input: Json
          task_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          result: Json | null
          credits_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id: string
          type: string
          input: Json
          task_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          result?: Json | null
          credits_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string
          type?: string
          input?: Json
          task_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          result?: Json | null
          credits_used?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rank_tracking: {
        Row: {
          id: string
          project_id: string
          keyword: string
          position: number | null
          volume: number | null
          trend: Json | null
          checked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          keyword: string
          position?: number | null
          volume?: number | null
          trend?: Json | null
          checked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          keyword?: string
          position?: number | null
          volume?: number | null
          trend?: Json | null
          checked_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rank_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
