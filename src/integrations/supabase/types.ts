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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      banned_users: {
        Row: {
          ban_expires_at: string | null
          banned_at: string | null
          banned_by: string | null
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          ban_expires_at?: string | null
          banned_at?: string | null
          banned_by?: string | null
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          ban_expires_at?: string | null
          banned_at?: string | null
          banned_by?: string | null
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          is_edited: boolean | null
          parent_reply_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          is_edited?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          is_edited?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          reply_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          reply_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          reply_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "discussion_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          location_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          location_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          location_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "public_locations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      google_maps_rate_limits: {
        Row: {
          created_at: string
          id: string
          last_request_at: string
          request_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_request_at?: string
          request_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_request_at?: string
          request_count?: number
          user_id?: string
        }
        Relationships: []
      }
      location_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          location_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          location_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          location_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_reviews: {
        Row: {
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_visit: boolean | null
          location_id: string
          rating: number
          review_text: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_visit?: boolean | null
          location_id: string
          rating: number
          review_text: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_visit?: boolean | null
          location_id?: string
          rating?: number
          review_text?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          borough: string | null
          contact_information: string | null
          created_at: string | null
          cross_streets: string | null
          description: string | null
          details: string | null
          email: string | null
          hours: Json | null
          id: string
          latitude: number
          local_items_selling: string | null
          longitude: number
          name: string
          neighborhood: string | null
          open_hours: string | null
          organization: string | null
          owner: string | null
          phone: string | null
          social_media_website1: string | null
          social_media_website2: string | null
          source: string | null
          status: string | null
          submitted_by: string | null
          tags: string[] | null
          type: string
          updated_at: string | null
          verified: boolean | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          borough?: string | null
          contact_information?: string | null
          created_at?: string | null
          cross_streets?: string | null
          description?: string | null
          details?: string | null
          email?: string | null
          hours?: Json | null
          id?: string
          latitude: number
          local_items_selling?: string | null
          longitude: number
          name: string
          neighborhood?: string | null
          open_hours?: string | null
          organization?: string | null
          owner?: string | null
          phone?: string | null
          social_media_website1?: string | null
          social_media_website2?: string | null
          source?: string | null
          status?: string | null
          submitted_by?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          borough?: string | null
          contact_information?: string | null
          created_at?: string | null
          cross_streets?: string | null
          description?: string | null
          details?: string | null
          email?: string | null
          hours?: Json | null
          id?: string
          latitude?: number
          local_items_selling?: string | null
          longitude?: number
          name?: string
          neighborhood?: string | null
          open_hours?: string | null
          organization?: string | null
          owner?: string | null
          phone?: string | null
          social_media_website1?: string | null
          social_media_website2?: string | null
          source?: string | null
          status?: string | null
          submitted_by?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
          zip_code?: string | null
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
      moderation_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          moderator_id: string | null
          reason: string | null
          target_id: string | null
          target_type: string | null
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      newsletter_rate_limits: {
        Row: {
          attempt_count: number
          created_at: string
          first_attempt_at: string
          id: string
          identifier: string
          last_attempt_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          identifier: string
          last_attempt_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          identifier?: string
          last_attempt_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          points: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          points?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          points?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      review_helpful_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "location_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpful_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          last_checked: string
          product_id: string | null
          subscribed: boolean
          subscription_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_checked?: string
          product_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_checked?: string
          product_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          alert_id: string
          area_description: string | null
          created_at: string
          description: string | null
          event_type: string
          expires: string | null
          garden_impact: string | null
          headline: string
          id: string
          onset: string | null
          recommendations: string[] | null
          severity: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_id: string
          area_description?: string | null
          created_at?: string
          description?: string | null
          event_type: string
          expires?: string | null
          garden_impact?: string | null
          headline: string
          id?: string
          onset?: string | null
          recommendations?: string[] | null
          severity: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_id?: string
          area_description?: string | null
          created_at?: string
          description?: string | null
          event_type?: string
          expires?: string | null
          garden_impact?: string | null
          headline?: string
          id?: string
          onset?: string | null
          recommendations?: string[] | null
          severity?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_locations: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          details: string | null
          hours: Json | null
          id: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          organization: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          type: string | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          details?: string | null
          hours?: Json | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          organization?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          details?: string | null
          hours?: Json | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          organization?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_google_maps_rate_limits: { Args: never; Returns: undefined }
      cleanup_newsletter_rate_limits: { Args: never; Returns: undefined }
      find_nearby_locations: {
        Args: {
          location_type?: string
          radius_km?: number
          search_lat: number
          search_lng: number
        }
        Returns: {
          address: string
          description: string
          distance_km: number
          id: string
          latitude: number
          longitude: number
          name: string
          organization: string
          type: string
          website: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_discussion_views: {
        Args: { discussion_id: string }
        Returns: undefined
      }
      is_user_banned: { Args: { _user_id: string }; Returns: boolean }
      profile_has_public_activity: {
        Args: { _profile_id: string }
        Returns: boolean
      }
      user_has_active_subscription: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
