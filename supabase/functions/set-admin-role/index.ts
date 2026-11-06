import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SetAdminRoleRequest {
  userId: string;
  role: 'client' | 'admin' | 'super_admin';
  email?: string;
  username?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!adminUser || adminUser.role !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Super admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { userId, role, email, username }: SetAdminRoleRequest = await req.json();

    if (!userId || !role) {
      return new Response(
        JSON.stringify({ error: 'User ID and role are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const validRoles = ['client', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    if (role === 'admin' || role === 'super_admin') {
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('auth_user_id', userId)
        .maybeSingle();

      if (!existingAdmin) {
        const { error: adminError } = await supabase.from('admin_users').insert({
          auth_user_id: userId,
          email: email || profile.email,
          username: username || profile.full_name || 'Admin User',
          role,
          is_active: true,
        });

        if (adminError) {
          throw adminError;
        }
      } else {
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ role, is_active: true })
          .eq('id', existingAdmin.id);

        if (updateError) {
          throw updateError;
        }
      }
    } else {
      await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('auth_user_id', userId);
    }

    await supabase.from('admin_audit_log').insert({
      actor_user_id: user.id,
      action: 'set_user_role',
      resource: 'user',
      resource_id: userId,
      metadata: {
        old_role: profile.role,
        new_role: role,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `User role updated to ${role}`,
        user: profile,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in set-admin-role:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
