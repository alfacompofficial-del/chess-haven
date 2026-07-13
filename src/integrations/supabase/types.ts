export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          black_id: string | null
          black_time_ms: number | null
          created_at: string
          fen: string
          id: string
          increment_seconds: number
          initial_seconds: number
          last_move_at: string | null
          mode: Database["public"]["Enums"]["game_mode"]
          pgn: string
          result_type: string | null
          status: Database["public"]["Enums"]["game_status"]
          time_category: Database["public"]["Enums"]["time_category"]
          tournament_id: string | null
          updated_at: string
          white_id: string | null
          white_time_ms: number | null
          winner_id: string | null
        }
        Insert: {
          black_id?: string | null
          black_time_ms?: number | null
          created_at?: string
          fen?: string
          id?: string
          increment_seconds?: number
          initial_seconds: number
          last_move_at?: string | null
          mode: Database["public"]["Enums"]["game_mode"]
          pgn?: string
          result_type?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          time_category: Database["public"]["Enums"]["time_category"]
          tournament_id?: string | null
          updated_at?: string
          white_id?: string | null
          white_time_ms?: number | null
          winner_id?: string | null
        }
        Update: {
          black_id?: string | null
          black_time_ms?: number | null
          created_at?: string
          fen?: string
          id?: string
          increment_seconds?: number
          initial_seconds?: number
          last_move_at?: string | null
          mode?: Database["public"]["Enums"]["game_mode"]
          pgn?: string
          result_type?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          time_category?: Database["public"]["Enums"]["time_category"]
          tournament_id?: string | null
          updated_at?: string
          white_id?: string | null
          white_time_ms?: number | null
          winner_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          payload: Json
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_queen: boolean
          avatar_url: string | null
          board_theme: string
          country_code: string | null
          created_at: string
          display_name: string | null
          id: string
          language: string
          nickname: string
          premoves_enabled: boolean
          rating_blitz: number
          rating_bullet: number
          rating_rapid: number
          show_legal_moves: boolean
          sounds_enabled: boolean
          updated_at: string
        }
        Insert: {
          auto_queen?: boolean
          avatar_url?: string | null
          board_theme?: string
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          language?: string
          nickname: string
          premoves_enabled?: boolean
          rating_blitz?: number
          rating_bullet?: number
          rating_rapid?: number
          show_legal_moves?: boolean
          sounds_enabled?: boolean
          updated_at?: string
        }
        Update: {
          auto_queen?: boolean
          avatar_url?: string | null
          board_theme?: string
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          language?: string
          nickname?: string
          premoves_enabled?: boolean
          rating_blitz?: number
          rating_bullet?: number
          rating_rapid?: number
          show_legal_moves?: boolean
          sounds_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          draws: number
          id: string
          joined_at: string
          losses: number
          score: number
          tournament_id: string
          user_id: string
          wins: number
        }
        Insert: {
          draws?: number
          id?: string
          joined_at?: string
          losses?: number
          score?: number
          tournament_id: string
          user_id: string
          wins?: number
        }
        Update: {
          draws?: number
          id?: string
          joined_at?: string
          losses?: number
          score?: number
          tournament_id?: string
          user_id?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          creator_id: string
          duration_minutes: number
          ends_at: string | null
          id: string
          increment_seconds: number
          initial_seconds: number
          name: string
          started_at: string | null
          status: Database["public"]["Enums"]["tournament_status"]
          time_category: Database["public"]["Enums"]["time_category"]
        }
        Insert: {
          created_at?: string
          creator_id: string
          duration_minutes: number
          ends_at?: string | null
          id?: string
          increment_seconds?: number
          initial_seconds?: number
          name: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          time_category?: Database["public"]["Enums"]["time_category"]
        }
        Update: {
          created_at?: string
          creator_id?: string
          duration_minutes?: number
          ends_at?: string | null
          id?: string
          increment_seconds?: number
          initial_seconds?: number
          name?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          time_category?: Database["public"]["Enums"]["time_category"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      friendship_status: "pending" | "accepted" | "declined"
      game_mode: "online" | "ai" | "tournament"
      game_status: "pending" | "active" | "finished" | "aborted"
      time_category: "bullet" | "blitz" | "rapid"
      tournament_status: "open" | "running" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      friendship_status: ["pending", "accepted", "declined"],
      game_mode: ["online", "ai", "tournament"],
      game_status: ["pending", "active", "finished", "aborted"],
      time_category: ["bullet", "blitz", "rapid"],
      tournament_status: ["open", "running", "finished"],
    },
  },
} as const
