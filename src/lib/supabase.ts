import { createClient } from '@supabase/supabase-js';

// Enhanced debugging for environment variables
console.log('🔍 Supabase Environment Check:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

if (import.meta.env.VITE_SUPABASE_URL) {
  console.log('📍 URL Value:', import.meta.env.VITE_SUPABASE_URL);
}
if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.log('🔑 Key Length:', import.meta.env.VITE_SUPABASE_ANON_KEY.length, 'characters');
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced error messages
if (!supabaseUrl) {
  console.error('❌ MISSING: VITE_SUPABASE_URL');
  console.log('📝 To fix: Add this to your .env file:');
  console.log('   VITE_SUPABASE_URL=https://your-project.supabase.co');
}

if (!supabaseAnonKey) {
  console.error('❌ MISSING: VITE_SUPABASE_ANON_KEY');
  console.log('📝 To fix: Add this to your .env file:');
  console.log('   VITE_SUPABASE_ANON_KEY=your_anon_key_here');
}

// Create client with enhanced error handling
let supabase: any = null;
let initializationError: string | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      }
    });
    console.log('✅ Supabase client created successfully');
    console.log('🔗 Connected to:', supabaseUrl);
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    initializationError = `Client creation failed: ${error}`;
    supabase = null;
  }
} else {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  initializationError = `Missing environment variables: ${missingVars.join(', ')}`;
  console.warn('⚠️ Supabase client not initialized:', initializationError);
}

// Test connection with comprehensive debugging
export const testConnection = async () => {
  console.log('🧪 Testing Supabase connection...');
  
  if (!supabase) {
    const error = initializationError || 'Supabase client not initialized';
    console.error('❌ Cannot test - client not initialized:', error);
    return { 
      success: false, 
      error,
      details: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        url: supabaseUrl,
        keyLength: supabaseAnonKey?.length || 0
      }
    };
  }

  try {
    console.log('📡 Testing database query...');
    const startTime = Date.now();
    
    // Test a simple query
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error('❌ Database query failed:', error);
      return { 
        success: false, 
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          responseTime
        }
      };
    }
    
    console.log(`✅ Database connection successful (${responseTime}ms)`);
    console.log('📊 Query result:', { data, count });
    
    return { 
      success: true, 
      data: { data, count },
      responseTime
    };
  } catch (error: any) {
    console.error('❌ Connection test exception:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown connection error',
      details: {
        name: error.name,
        stack: error.stack
      }
    };
  }
};

// Enhanced connection status
export const getConnectionStatus = () => {
  const status = {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isInitialized: !!supabase,
    initializationError,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Not set',
    keyLength: supabaseAnonKey?.length || 0,
    urlValid: supabaseUrl ? supabaseUrl.includes('supabase.co') : false,
    keyValid: supabaseAnonKey ? supabaseAnonKey.length > 100 : false
  };
  
  console.log('📋 Connection Status:', status);
  return status;
};

// Safe auth methods with better error handling
export const safeAuth = {
  signUp: async (credentials: { email: string; password: string }) => {
    if (!supabase) {
      throw new Error(`Supabase not initialized: ${initializationError}`);
    }
    const result = await supabase.auth.signUp(credentials);
    console.log('📝 SignUp result:', result.error ? 'Failed' : 'Success');
    return result;
  },
  
  signInWithPassword: async (credentials: { email: string; password: string }) => {
    if (!supabase) {
      throw new Error(`Supabase not initialized: ${initializationError}`);
    }
    const result = await supabase.auth.signInWithPassword(credentials);
    console.log('🔐 SignIn result:', result.error ? 'Failed' : 'Success');
    return result;
  },
  
  signOut: async () => {
    if (!supabase) {
      throw new Error(`Supabase not initialized: ${initializationError}`);
    }
    const result = await supabase.auth.signOut();
    console.log('🚪 SignOut result:', result.error ? 'Failed' : 'Success');
    return result;
  },
  
  getSession: async () => {
    if (!supabase) {
      console.warn('⚠️ Cannot get session - Supabase not initialized');
      return { data: { session: null }, error: { message: initializationError } };
    }
    return supabase.auth.getSession();
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase) {
      console.warn('⚠️ Auth state change listener not available - Supabase not initialized');
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }
};

export { supabase };

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          country?: string | null;
          balance?: number;
          total_deposit?: number;
          profit?: number;
          total_invested?: number;
          total_withdrawn?: number;
          referral_code: string;
          referred_by?: string | null;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          is_active?: boolean;
        };
        Update: {
          username?: string;
          full_name?: string | null;
          phone?: string | null;
          country?: string | null;
          balance?: number;
          total_deposit?: number;
          profit?: number;
          total_invested?: number;
          total_withdrawn?: number;
        };
      };
      investment_plans: {
        Row: {
          id: string;
          name: string;
          min_amount: number;
          max_amount: number;
          interest_rate: number;
          duration_days: number;
          is_active: boolean;
          features: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          min_amount: number;
          max_amount: number;
          interest_rate: number;
          duration_days: number;
          is_active?: boolean;
          features?: string[];
        };
        Update: {
          name?: string;
          min_amount?: number;
          max_amount?: number;
          interest_rate?: number;
          duration_days?: number;
          is_active?: boolean;
          features?: string[];
        };
      };
      user_investments: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          amount: number;
          status?: 'active' | 'completed' | 'cancelled';
          start_date?: string;
          end_date: string;
          total_earned?: number;
          last_interest_date?: string | null;
        };
        Update: {
          amount?: number;
          status?: 'active' | 'completed' | 'cancelled';
          end_date?: string;
          total_earned?: number;
          last_interest_date?: string | null;
        };
      };
      transactions: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'deposit' | 'withdraw' | 'interest' | 'referral_bonus';
          amount: number;
          status?: 'pending' | 'approved' | 'rejected';
          payment_method?: string | null;
          transaction_hash?: string | null;
          notes?: string | null;
          admin_notes?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          payment_method?: string | null;
          transaction_hash?: string | null;
          notes?: string | null;
          admin_notes?: string | null;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          commission_amount: number;
          commission_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          commission_amount?: number;
          commission_paid?: boolean;
        };
        Update: {
          commission_amount?: number;
          commission_paid?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
        };
        Update: {
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
        };
      };
      kyc_verifications: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: 'passport' | 'drivers_license' | 'national_id';
          document_front_url?: string | null;
          document_back_url?: string | null;
          selfie_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          document_type?: 'passport' | 'drivers_license' | 'national_id';
          document_front_url?: string | null;
          document_back_url?: string | null;
          selfie_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'super_admin' | 'manager' | 'support';
          permissions: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'super_admin' | 'manager' | 'support';
          permissions?: any;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          role?: 'super_admin' | 'manager' | 'support';
          permissions?: any;
          is_active?: boolean;
        };
      };
      admin_audit_log: {
        Row: {
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
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          old_values?: any;
          new_values?: any;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          target_table?: string | null;
          target_id?: string | null;
          old_values?: any;
          new_values?: any;
        };
      };
    };
    Views: {
      active_investments_with_plans: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          status: string;
          start_date: string;
          end_date: string;
          total_earned: number;
          plan_name: string;
          interest_rate: number;
          duration_days: number;
          username: string;
          email: string;
        };
      };
      pending_transactions_with_users: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          status: string;
          payment_method: string | null;
          transaction_hash: string | null;
          notes: string | null;
          created_at: string;
          username: string;
          email: string;
          full_name: string | null;
        };
      };
    };
    Functions: {
      get_user_dashboard_stats: {
        Args: { user_id_param: string };
        Returns: {
          total_deposit: number;
          total_withdraw: number;
          total_profit: number;
          pending_transactions: number;
        };
      };
      get_admin_dashboard_stats: {
        Args: Record<string, never>;
        Returns: {
          total_users: number;
          active_users: number;
          deactive_users: number;
          total_invest: number;
          pending_invest: number;
          total_interest: number;
          total_withdraw: number;
          pending_withdraw: number;
        };
      };
      calculate_investment_returns: {
        Args: { investment_id_param: string };
        Returns: number;
      };
      generate_referral_code: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
};