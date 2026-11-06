import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext as SupabaseAuthContext, User } from '@supabase/supabase-js'; // Use Supabase types
import { supabase, safeAuth, getConnectionStatus } from '../lib/supabase'; // Import the initialized Supabase client
import { AdminUser } from '../types'; // Keeping AdminUser interface for clarity, but primarily using Supabase User

interface AdminAuthContextType {
  // We use the Supabase User type directly
  admin: User | null;
  // Flag to quickly check if the authenticated user has the 'admin' role
  isAdmin: boolean; 
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check connection status
  useEffect(() => {
    const status = getConnectionStatus();
    console.log('🔍 Admin Auth - Connection Status:', status);
    
    if (!status.isInitialized) {
      console.error('❌ Admin Auth - Supabase not connected');
    }
  }, []);

  // Function to check user role from admin_users table
  const checkRole = useCallback(async (user: User | null) => {
    if (!user || !supabase) {
      setIsAdmin(false);
      return;
    }

    try {
      // Check if user exists in admin_users table and is active
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        return;
      }

      if (adminData && (adminData.role === 'super_admin' || adminData.role === 'manager' || adminData.role === 'support')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error in checkRole:', error);
      setIsAdmin(false);
    }
  }, []);

  // Effect to handle initial session load and ongoing auth changes
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const { data: authListener } = safeAuth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setAdminUser(session.user);
          // Check role immediately upon sign-in
          checkRole(session.user); 
        } else if (event === 'SIGNED_OUT') {
          setAdminUser(null);
          checkRole(null);
        }
        setIsLoading(false);
      }
    );

    // Initial check in case the session is already active
    safeAuth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAdminUser(session.user);
        checkRole(session.user);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkRole]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Database not connected. Please check your internet connection and try again.');
      }

      const { data, error } = await safeAuth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setAdminUser(data.user);
        // Wait for role check to complete
        await checkRole(data.user);

        // Verify admin status after role check
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', data.user.email)
          .eq('is_active', true)
          .maybeSingle();

        if (adminError || !adminData) {
          throw new Error('You do not have admin privileges. Please contact support.');
        }

        if (!['super_admin', 'manager', 'support'].includes(adminData.role)) {
          throw new Error('You do not have admin privileges. Please contact support.');
        }

        // Set admin status immediately
        setIsAdmin(true);
      }
      setIsLoading(false);

    } catch (e: any) {
      console.error('Admin Login failed:', e.message);
      setAdminUser(null);
      setIsAdmin(false);
      setIsLoading(false);
      throw new Error(e.message || 'Login failed');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await safeAuth.signOut();
    if (error) {
      console.error('Admin Logout failed:', error.message);
      setIsLoading(false);
      return;
    }
    // Auth listener handles clearing state and setting isLoading(false)
  };

  const value = {
    admin: adminUser,
    isAdmin,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}