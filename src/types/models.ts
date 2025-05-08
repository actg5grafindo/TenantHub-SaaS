// Common types used across the application

export interface Tenant {
  id: string;
  name: string;
  description: string;
  dataQuota: number;
  createdAt: string;
  status: "active" | "inactive";
  companiesCount: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  tenantName?: string;
  createdAt: string;
  status: "active" | "inactive";
  usersCount: number;
  industry?: string;
  size?: "small" | "medium" | "large" | "enterprise";
  website?: string;
  address?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "superadmin" | "owner" | "user" | null;
  tenantId?: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
  status: "active" | "inactive" | "pending";
  lastLogin?: string;
  jobTitle?: string;
  department?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  assignedToName?: string;
  createdBy: string;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  companyId: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "performance" | "financial" | "usage" | "custom";
  createdAt: string;
  createdBy: string;
  companyId: string;
  data: any;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses?: number;
  currentUses: number;
  status: "active" | "inactive" | "expired";
  tenantId?: string;
  companyId?: string;
  createdAt: string;
  createdBy: string;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
}
