export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          user_id: string | null
          prompt_text: string
          image_url: string | null
          style: string
          response_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          prompt_text: string
          image_url?: string | null
          style: string
          response_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          prompt_text?: string
          image_url?: string | null
          style?: string
          response_id?: string
          created_at?: string
        }
      }
      generated_images: {
        Row: {
          id: string
          prompt_id: string
          svg_url: string
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          svg_url: string
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          svg_url?: string
          created_at?: string
        }
      }
    }
  }
}

