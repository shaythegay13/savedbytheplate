export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      garden_feedback: {
        Row: {
          actual_harvest_time: string | null
          feedback_date: string
          garden_plan_id: string
          growth_issues: string | null
          harvest_notes: string | null
          id: string
          plant_name: string
          season_planted: string | null
          success_rating: number | null
          user_id: string
          would_plant_again: boolean | null
          yield_rating: number | null
        }
        Insert: {
          actual_harvest_time?: string | null
          feedback_date?: string
          garden_plan_id: string
          growth_issues?: string | null
          harvest_notes?: string | null
          id?: string
          plant_name: string
          season_planted?: string | null
          success_rating?: number | null
          user_id: string
          would_plant_again?: boolean | null
          yield_rating?: number | null
        }
        Update: {
          actual_harvest_time?: string | null
          feedback_date?: string
          garden_plan_id?: string
          growth_issues?: string | null
          harvest_notes?: string | null
          id?: string
          plant_name?: string
          season_planted?: string | null
          success_rating?: number | null
          user_id?: string
          would_plant_again?: boolean | null
          yield_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "garden_feedback_garden_plan_id_fkey"
            columns: ["garden_plan_id"]
            isOneToOne: false
            referencedRelation: "garden_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_insights: {
        Row: {
          average_yield_rating: number | null
          best_planting_months: string[] | null
          common_issues: string[] | null
          companion_plants: string[] | null
          hardiness_zone: string
          id: string
          last_updated: string
          plant_name: string
          soil_type: string
          success_rate: number | null
          successful_attempts: number | null
          sunlight: string
          total_attempts: number | null
        }
        Insert: {
          average_yield_rating?: number | null
          best_planting_months?: string[] | null
          common_issues?: string[] | null
          companion_plants?: string[] | null
          hardiness_zone: string
          id?: string
          last_updated?: string
          plant_name: string
          soil_type: string
          success_rate?: number | null
          successful_attempts?: number | null
          sunlight: string
          total_attempts?: number | null
        }
        Update: {
          average_yield_rating?: number | null
          best_planting_months?: string[] | null
          common_issues?: string[] | null
          companion_plants?: string[] | null
          hardiness_zone?: string
          id?: string
          last_updated?: string
          plant_name?: string
          soil_type?: string
          success_rate?: number | null
          successful_attempts?: number | null
          sunlight?: string
          total_attempts?: number | null
        }
        Relationships: []
      }
      garden_notifications: {
        Row: {
          created_at: string
          garden_plan_id: string
          id: string
          message: string
          notification_type: string
          plant_name: string | null
          scheduled_date: string
          sent: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          garden_plan_id: string
          id?: string
          message: string
          notification_type: string
          plant_name?: string | null
          scheduled_date: string
          sent?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          garden_plan_id?: string
          id?: string
          message?: string
          notification_type?: string
          plant_name?: string | null
          scheduled_date?: string
          sent?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_notifications_garden_plan_id_fkey"
            columns: ["garden_plan_id"]
            isOneToOne: false
            referencedRelation: "garden_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_plans: {
        Row: {
          created_at: string
          experience_level: string
          goals: string
          hardiness_zone: string
          id: string
          notification_preferences: Json | null
          plan_data: Json
          preferred_plants: string | null
          rainfall: string
          season: string
          soil_type: string
          space_description: string | null
          space_size: string
          space_type: string
          sunlight: string
          time_commitment: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_level: string
          goals: string
          hardiness_zone: string
          id?: string
          notification_preferences?: Json | null
          plan_data: Json
          preferred_plants?: string | null
          rainfall: string
          season: string
          soil_type: string
          space_description?: string | null
          space_size: string
          space_type: string
          sunlight: string
          time_commitment: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_level?: string
          goals?: string
          hardiness_zone?: string
          id?: string
          notification_preferences?: Json | null
          plan_data?: Json
          preferred_plants?: string | null
          rainfall?: string
          season?: string
          soil_type?: string
          space_description?: string | null
          space_size?: string
          space_type?: string
          sunlight?: string
          time_commitment?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lungs_data1: {
        Row: {
          Address: string
          "Contact Information": string | null
          Hours: string | null
          latitude: number | null
          longitude: number | null
          "Name of Garden": string
          Neighborhood: string | null
          Website: string | null
        }
        Insert: {
          Address: string
          "Contact Information"?: string | null
          Hours?: string | null
          latitude?: number | null
          longitude?: number | null
          "Name of Garden": string
          Neighborhood?: string | null
          Website?: string | null
        }
        Update: {
          Address?: string
          "Contact Information"?: string | null
          Hours?: string | null
          latitude?: number | null
          longitude?: number | null
          "Name of Garden"?: string
          Neighborhood?: string | null
          Website?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
