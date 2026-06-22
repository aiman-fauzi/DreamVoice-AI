export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Language = "English" | "Bahasa Malaysia";
type NarrationKind = "google_tts" | "manual_recording";
type NarrationProvider = "google" | "browser_recording";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string | null; created_at: string; updated_at: string };
        Insert: { id: string; display_name?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; display_name?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      children: {
        Row: {
          id: string;
          parent_id: string;
          name: string;
          age: number;
          language: Language;
          interests: string[];
          bedtime_tone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          name: string;
          age: number;
          language?: Language;
          interests?: string[];
          bedtime_tone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          name?: string;
          age?: number;
          language?: Language;
          interests?: string[];
          bedtime_tone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          parent_id: string;
          child_id: string;
          theme_key: string;
          title: string | null;
          prompt: string;
          story_text: string;
          language: Language;
          status: string;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          child_id: string;
          theme_key: string;
          title?: string | null;
          prompt: string;
          story_text: string;
          language: Language;
          status?: string;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          child_id?: string;
          theme_key?: string;
          title?: string | null;
          prompt?: string;
          story_text?: string;
          language?: Language;
          status?: string;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      narrations: {
        Row: {
          id: string;
          parent_id: string;
          story_id: string;
          kind: NarrationKind;
          provider: NarrationProvider;
          voice_name: string | null;
          text_characters: number;
          storage_bucket: string;
          storage_path: string;
          duration_seconds: number | null;
          status: string;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          story_id: string;
          kind: NarrationKind;
          provider: NarrationProvider;
          voice_name?: string | null;
          text_characters?: number;
          storage_bucket?: string;
          storage_path: string;
          duration_seconds?: number | null;
          status?: string;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          story_id?: string;
          kind?: NarrationKind;
          provider?: NarrationProvider;
          voice_name?: string | null;
          text_characters?: number;
          storage_bucket?: string;
          storage_path?: string;
          duration_seconds?: number | null;
          status?: string;
          error_message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tts_usage_monthly: {
        Row: {
          id: string;
          parent_id: string;
          month_key: string;
          provider: string;
          characters_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          month_key: string;
          provider?: string;
          characters_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          month_key?: string;
          provider?: string;
          characters_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};