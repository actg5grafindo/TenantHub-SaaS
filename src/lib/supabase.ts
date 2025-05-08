import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if credentials are missing
let supabaseClient: ReturnType<typeof createClient<Database>>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are missing. Using mock client with limited functionality.",
  );

  // Create a mock client with dummy methods
  supabaseClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      insert: () => Promise.resolve({ error: null }),
    }),
  } as any;
} else {
  // Create the real client if credentials are available
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

// Notification functions
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data || [];
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }

  return true;
}

export async function createNotification(notification: {
  user_id: string;
  title: string;
  message: string;
  type?: string;
}) {
  const { error } = await supabase.from("notifications").insert([
    {
      user_id: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: notification.type || "info",
      read: false,
    },
  ]);

  if (error) {
    console.error("Error creating notification:", error);
    return false;
  }

  return true;
}

// Coupon management functions
export async function getCoupons(tenantId?: string, companyId?: string) {
  let query = supabase.from("coupons").select("*");

  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }

  if (companyId) {
    query = query.eq("company_id", companyId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }

  return data || [];
}

export async function createCoupon(coupon: {
  code: string;
  description?: string;
  discount_percent?: number;
  discount_amount?: number;
  valid_from: string;
  valid_until?: string;
  max_uses?: number;
  tenant_id?: string;
  company_id?: string;
  is_active?: boolean;
}) {
  const { error } = await supabase.from("coupons").insert([
    {
      code: coupon.code,
      description: coupon.description,
      discount_percent: coupon.discount_percent || 0,
      discount_amount: coupon.discount_amount || 0,
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until,
      max_uses: coupon.max_uses,
      current_uses: 0,
      tenant_id: coupon.tenant_id,
      company_id: coupon.company_id,
      is_active: coupon.is_active !== undefined ? coupon.is_active : true,
    },
  ]);

  if (error) {
    console.error("Error creating coupon:", error);
    return false;
  }

  return true;
}

export async function updateCoupon(
  id: string,
  coupon: {
    code?: string;
    description?: string;
    discount_percent?: number;
    discount_amount?: number;
    valid_from?: string;
    valid_until?: string;
    max_uses?: number;
    current_uses?: number;
    tenant_id?: string;
    company_id?: string;
    is_active?: boolean;
  },
) {
  const { error } = await supabase.from("coupons").update(coupon).eq("id", id);

  if (error) {
    console.error("Error updating coupon:", error);
    return false;
  }

  return true;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);

  if (error) {
    console.error("Error deleting coupon:", error);
    return false;
  }

  return true;
}
