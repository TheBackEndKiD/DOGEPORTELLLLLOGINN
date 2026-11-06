export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  balance: number;
  total_deposit: number;
  profit: number;
  total_invested: number;
  total_withdrawn: number;
  referral_code: string;
  referred_by: string | null;
  kyc_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User extends Profile {
  uid: string;
  accountStatus: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'interest' | 'referral_bonus';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_method: string | null;
  transaction_hash: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  duration_days: number;
  is_active: boolean;
  features: string[];
  created_at: string;
}

export interface UserInvestment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  total_earned: number;
  last_interest_date: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface KycVerification {
  id: string;
  user_id: string;
  document_type: 'passport' | 'drivers_license' | 'national_id';
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'manager' | 'support';
  permissions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_deposit: number;
  total_withdraw: number;
  total_profit: number;
  pending_transactions: number;
}

export interface AdminDashboardStats {
  total_users: number;
  active_users: number;
  deactive_users: number;
  total_invest: number;
  pending_invest: number;
  total_interest: number;
  total_withdraw: number;
  pending_withdraw: number;
}

export interface KycDocument {
  id: string;
  userId: string;
  type: string;
  frontDocument?: File;
  backDocument?: File;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}