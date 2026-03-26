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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cost_receipts: {
        Row: {
          cost_id: string
          file_name: string
          file_url: string
          id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          cost_id: string
          file_name: string
          file_url: string
          id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          cost_id?: string
          file_name?: string
          file_url?: string
          id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_receipts_cost_id_fkey"
            columns: ["cost_id"]
            isOneToOne: false
            referencedRelation: "costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_receipts_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      costs: {
        Row: {
          actual_original_amount: number | null
          actual_usd: number | null
          budgeted_usd: number
          category: Database["public"]["Enums"]["cost_category"]
          created_at: string
          created_by: string | null
          currency: string | null
          description: string
          exhibition_id: string
          id: string
          paid_at: string | null
          updated_at: string
        }
        Insert: {
          actual_original_amount?: number | null
          actual_usd?: number | null
          budgeted_usd?: number
          category: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description: string
          exhibition_id: string
          id?: string
          paid_at?: string | null
          updated_at?: string
        }
        Update: {
          actual_original_amount?: number | null
          actual_usd?: number | null
          budgeted_usd?: number
          category?: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string
          exhibition_id?: string
          id?: string
          paid_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "costs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "costs_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibition_gates: {
        Row: {
          created_at: string
          exhibition_id: string
          id: string
          name: string
          order: number
          passed_at: string | null
          passed_by: string | null
          status: Database["public"]["Enums"]["gate_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          exhibition_id: string
          id?: string
          name: string
          order: number
          passed_at?: string | null
          passed_by?: string | null
          status?: Database["public"]["Enums"]["gate_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          exhibition_id?: string
          id?: string
          name?: string
          order?: number
          passed_at?: string | null
          passed_by?: string | null
          status?: Database["public"]["Enums"]["gate_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_gates_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exhibition_gates_passed_by_fkey"
            columns: ["passed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibition_kpis: {
        Row: {
          a_leads: number
          contracts: number
          created_by: string | null
          distributors: number
          exec_meetings: number
          exhibition_id: string
          id: string
          proposals: number
          qualified_leads: number
          recorded_at: string
          rev_12m_usd: number
          rev_6m_usd: number
          visitors: number
        }
        Insert: {
          a_leads?: number
          contracts?: number
          created_by?: string | null
          distributors?: number
          exec_meetings?: number
          exhibition_id: string
          id?: string
          proposals?: number
          qualified_leads?: number
          recorded_at?: string
          rev_12m_usd?: number
          rev_6m_usd?: number
          visitors?: number
        }
        Update: {
          a_leads?: number
          contracts?: number
          created_by?: string | null
          distributors?: number
          exec_meetings?: number
          exhibition_id?: string
          id?: string
          proposals?: number
          qualified_leads?: number
          recorded_at?: string
          rev_12m_usd?: number
          rev_6m_usd?: number
          visitors?: number
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_kpis_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exhibition_kpis_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibition_members: {
        Row: {
          created_at: string
          exhibition_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exhibition_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exhibition_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_members_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exhibition_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibitions: {
        Row: {
          budget_usd: number
          city: string
          country: string
          created_at: string
          created_by: string | null
          ends_at: string
          goal_leads: number
          goal_meetings: number
          id: string
          name: string
          starts_at: string
          status: Database["public"]["Enums"]["exhibition_status"]
          updated_at: string
          venue_name: string
        }
        Insert: {
          budget_usd?: number
          city: string
          country: string
          created_at?: string
          created_by?: string | null
          ends_at: string
          goal_leads?: number
          goal_meetings?: number
          id?: string
          name: string
          starts_at: string
          status?: Database["public"]["Enums"]["exhibition_status"]
          updated_at?: string
          venue_name: string
        }
        Update: {
          budget_usd?: number
          city?: string
          country?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string
          goal_leads?: number
          goal_meetings?: number
          id?: string
          name?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["exhibition_status"]
          updated_at?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "exhibitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          body: string | null
          created_at: string
          id: string
          lead_id: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          lead_id: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_next_actions: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          due_at: string | null
          id: string
          is_done: boolean
          lead_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          due_at?: string | null
          id?: string
          is_done?: boolean
          lead_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          due_at?: string | null
          id?: string
          is_done?: boolean
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_next_actions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_next_actions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assignee_id: string | null
          collected_at: string
          company: string
          country: string | null
          created_at: string
          email: string | null
          exhibition_id: string
          full_name: string
          grade: Database["public"]["Enums"]["lead_grade"]
          id: string
          interest: string | null
          is_qualified: boolean
          lead_type: string | null
          phone: string | null
          sla_due_at: string | null
          source: Database["public"]["Enums"]["lead_source"]
          title: string | null
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          collected_at?: string
          company: string
          country?: string | null
          created_at?: string
          email?: string | null
          exhibition_id: string
          full_name: string
          grade?: Database["public"]["Enums"]["lead_grade"]
          id?: string
          interest?: string | null
          is_qualified?: boolean
          lead_type?: string | null
          phone?: string | null
          sla_due_at?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          collected_at?: string
          company?: string
          country?: string | null
          created_at?: string
          email?: string | null
          exhibition_id?: string
          full_name?: string
          grade?: Database["public"]["Enums"]["lead_grade"]
          id?: string
          interest?: string | null
          is_qualified?: boolean
          lead_type?: string | null
          phone?: string | null
          sla_due_at?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          category: Database["public"]["Enums"]["task_category"]
          created_at: string
          days_before_start: number | null
          description: string | null
          id: string
          is_active: boolean
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["task_category"]
          created_at?: string
          days_before_start?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          days_before_start?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          title?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          category: Database["public"]["Enums"]["task_category"]
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          exhibition_id: string
          id: string
          status: Database["public"]["Enums"]["task_status"]
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          category: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          exhibition_id: string
          id?: string
          status?: Database["public"]["Enums"]["task_status"]
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          exhibition_id?: string
          id?: string
          status?: Database["public"]["Enums"]["task_status"]
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      activity_type: "note" | "call" | "email" | "meeting" | "status_change"
      cost_category:
        | "booth"
        | "flight"
        | "hotel"
        | "interpreter"
        | "promotion"
        | "other"
      exhibition_status: "planning" | "active" | "closed" | "cancelled"
      gate_status: "passed" | "pending" | "blocked"
      lead_grade: "A" | "B" | "C" | "ungraded"
      lead_source: "badge_scan" | "business_card" | "manual"
      task_category: "logistics" | "booth" | "marketing" | "onsite" | "post"
      task_status: "todo" | "in_progress" | "done" | "blocked"
      user_role: "admin" | "ops" | "sales" | "executive"
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
      activity_type: ["note", "call", "email", "meeting", "status_change"],
      cost_category: [
        "booth",
        "flight",
        "hotel",
        "interpreter",
        "promotion",
        "other",
      ],
      exhibition_status: ["planning", "active", "closed", "cancelled"],
      gate_status: ["passed", "pending", "blocked"],
      lead_grade: ["A", "B", "C", "ungraded"],
      lead_source: ["badge_scan", "business_card", "manual"],
      task_category: ["logistics", "booth", "marketing", "onsite", "post"],
      task_status: ["todo", "in_progress", "done", "blocked"],
      user_role: ["admin", "ops", "sales", "executive"],
    },
  },
} as const
