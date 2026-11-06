import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js'; // Import Supabase types for clarity
import { supabase, safeAuth, getConnectionStatus } from '../lib/supabase';

import { Profile } from '../types';

interface UserProfile {
  id: string;
  uid: string;
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

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>; // Changed void to Promise<void> for consistency
  updateUser: (userData: Partial<UserProfile>) => Promise<void>; // Added Promise<void>
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generateUsernameFromEmail(email: string): string {
  const base = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '') || 'user';
  const suffix = Math.floor(Math.random() * 9000 + 1000).toString();
  return `${base}${suffix}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check connection status on mount
  useEffect(() => {
    const status = getConnectionStatus();
    console.log('🔍 Auth Context - Connection Status:', status);
    
    if (!status.isInitialized) {
      console.error('❌ Supabase connection failed:', {
        hasUrl: status.hasUrl,
        hasKey: status.hasKey,
        url: status.url,
        keyLength: status.keyLength
      });
    }
  }, []);

  // Function to fetch or refresh user data from the 'profiles' table
  const checkUser = useCallback(async (session?: Session | null) => {
    if (!supabase) {
      console.warn('⚠️ Skipping user check - Supabase not initialized');
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      // If no session is provided, fetch the current one
      const currentSession = session || (await safeAuth.getSession()).data.session;
      
      if (!currentSession || !currentSession.user) {
        setUser(null);
        return;
      }
      
      const { user } = currentSession;

      // Fetch custom profile data
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If the user authenticated but has no profile row, auto-create one.
      // This handles users whose profile insert failed during signup (e.g.
      // before the INSERT RLS policy existed) so they are not locked out.
      if (!profile) {
        const newUsername = generateUsernameFromEmail(user.email || '');
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: newUsername,
            email: user.email || '',
            referral_code: generateReferralCode(),
            balance: 0,
            total_deposit: 0,
            profit: 0,
            total_invested: 0,
            total_withdrawn: 0,
            kyc_status: 'pending',
            is_active: true,
          })
          .select('*')
          .maybeSingle();

        if (insertError) {
          console.error('Failed to auto-create profile:', insertError);
          setUser(null);
          await safeAuth.signOut();
          return;
        }
        profile = inserted;
      }

      if (profile) {
        setUser({
          id: profile.id,
          uid: profile.id.substring(0, 8),
          username: profile.username,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          country: profile.country,
          balance: Number(profile.balance) || 0,
          total_deposit: Number(profile.total_deposit) || 0,
          profit: Number(profile.profit) || 0,
          total_invested: Number(profile.total_invested) || 0,
          total_withdrawn: Number(profile.total_withdrawn) || 0,
          referral_code: profile.referral_code,
          referred_by: profile.referred_by,
          kyc_status: profile.kyc_status,
          is_active: profile.is_active,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        });
      } else {
        setUser(null);
        await safeAuth.signOut();
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {    
    // Initial check on mount
    checkUser();

    // Set up the listener for continuous state updates
    const { data: authListener } = safeAuth.onAuthStateChange(
      async (event, session) => {
        // Only run detailed profile check when necessary events occur
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
          await checkUser(session);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [checkUser]);

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Database not connected. Please check your internet connection and try again.');
      }

      const { data, error: authError } = await safeAuth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const referralCode = generateReferralCode();

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                username,
                email: data.user.email || email,
                referral_code: referralCode,
                balance: 0,
                total_invested: 0,
                total_withdrawn: 0,
                total_deposit: 0,
                profit: 0,
                kyc_status: 'pending',
                is_active: true
            });

        if (profileError) {
          console.error('Profile creation error during signup:', profileError);
          throw new Error(`Account created but profile setup failed: ${profileError.message}. Please try logging in.`);
        }

        await checkUser(data.session);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Database not connected. Please check your internet connection and try again.');
      }

      const { error, data } = await safeAuth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        await checkUser(data.session);
      } else {
        throw new Error('Login succeeded but no session was returned. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await safeAuth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!user) {
        console.warn('Attempted to update user data without an active user session.');
        return;
    }

    try {
      const updatePayload: any = {};

      if (userData.full_name !== undefined) updatePayload.full_name = userData.full_name;
      if (userData.phone !== undefined) updatePayload.phone = userData.phone;
      if (userData.country !== undefined) updatePayload.country = userData.country;

      if (Object.keys(updatePayload).length === 0) return;

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (error) throw error;

      setUser((current) => (current ? { ...current, ...userData } : null));

    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}