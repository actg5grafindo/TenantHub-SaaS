export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
        };
      };
      coupons: {
        Row: {
          id: string;
          created_at: string;
          code: string;
          discount_percent: number;
          discount_amount: number | null;
          valid_from: string;
          valid_until: string | null;
          max_uses: number | null;
          current_uses: number;
          tenant_id: string | null;
          company_id: string | null;
          is_active: boolean;
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          code: string;
          discount_percent: number;
          discount_amount?: number | null;
          valid_from?: string;
          valid_until?: string | null;
          max_uses?: number | null;
          current_uses?: number;
          tenant_id?: string | null;
          company_id?: string | null;
          is_active?: boolean;
          description?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          code?: string;
          discount_percent?: number;
          discount_amount?: number | null;
          valid_from?: string;
          valid_until?: string | null;
          max_uses?: number | null;
          current_uses?: number;
          tenant_id?: string | null;
          company_id?: string | null;
          is_active?: boolean;
          description?: string | null;
        };
      };
    };
  };
}
