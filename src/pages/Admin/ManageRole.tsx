import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Role {
  id: string;
  name: string;
  permissions: string[];
  user_count: number;
  created_at: string;
}

export default function ManageRole() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    'manage_users',
    'manage_transactions', 
    'manage_investments',
    'manage_kyc',
    'manage_withdrawals',
    'manage_deposits',
    'view_analytics',
    'manage_settings',
    'manage_admins',
    'send_notifications'
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    if (!supabase) return;

    try {
      // Get admin roles with user counts
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('is_active', true);

      if (adminError) throw adminError;

      // Count users by role
      const roleCounts: Record<string, number> = {};
      adminData?.forEach(admin => {
        roleCounts[admin.role] = (roleCounts[admin.role] || 0) + 1;
      });

      // Create role objects
      const systemRoles = [
        {
          id: 'super_admin',
          name: 'Super Admin',
          permissions: ['all'],
          user_count: roleCounts['super_admin'] || 0,
          created_at: new Date().toISOString()
        },
        {
          id: 'manager',
          name: 'Manager',
          permissions: availablePermissions.filter(p => p !== 'manage_admins'),
          user_count: roleCounts['manager'] || 0,
          created_at: new Date().toISOString()
        },
        {
          id: 'support',
          name: 'Support',
          permissions: ['manage_tickets', 'view_analytics', 'send_notifications'],
          user_count: roleCounts['support'] || 0,
          created_at: new Date().toISOString()
        }
      ];

      setRoles(systemRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Custom role creation feature coming soon! Currently using system roles: Super Admin, Manager, Support');
    setShowCreateForm(false);
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      alert(`Role: ${role.name}\n\nPermissions:\n${role.permissions.join('\n')}\n\nActive Users: ${role.user_count}\n\nNote: System roles are predefined and cannot be modified.`);
    }
  };

  const handleAssignRole = async (roleId: string) => {
    const email = prompt('Enter admin email to assign this role:');
    if (!email) return;

    try {
      const { data: user } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single();

      if (!user) {
        alert('Admin user not found with that email');
        return;
      }

      const { error } = await supabase
        .from('admin_users')
        .update({ role: roleId })
        .eq('email', email);

      if (error) throw error;

      alert(`Role ${roleId} assigned to ${email} successfully!`);
      fetchRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign role');
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Roles</h1>
          
          <div className="flex space-x-4">
            <button
              onClick={fetchRoles}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add role</span>
            </button>
          </div>
        </div>
        
        <input
          type="text"
          placeholder="Search Role Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Create Role Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Role</h2>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map(permission => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{permission.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Role
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading roles...
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No roles found
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role, index) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission, idx) => (
                          <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {role.user_count} users
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRole(role.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAssignRole(role.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}