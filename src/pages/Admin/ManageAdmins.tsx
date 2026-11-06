import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Admin {
  id: string;
  roles: string[];
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export default function ManageAdmins() {
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    role: 'support' as 'super_admin' | 'manager' | 'support',
    is_active: true
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    if (!supabase) return;

    try {
      // Get all admin users
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (adminData) {
        const formattedAdmins = adminData.map((admin: any) => ({
          id: admin.id,
          roles: [admin.role],
          username: admin.email.split('@')[0], // Extract username from email
          email: admin.email,
          is_active: admin.is_active,
          created_at: admin.created_at,
          last_login: admin.updated_at // Use updated_at as last_login approximation
        }));
        setAdmins(formattedAdmins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      alert('Please enter an email address');
      return;
    }

    try {
      // First check if admin already exists
      const { data: existing } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (existing) {
        alert('Admin with this email already exists');
        return;
      }

      // For creating admin, we need a user ID from auth.users
      // In a real implementation, this would be handled differently
      const userId = crypto.randomUUID(); // Generate temporary ID

      const { error } = await supabase
        .from('admin_users')
        .insert({
          id: userId,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active,
          permissions: JSON.stringify(['all'])
        });

      if (error) throw error;

      alert(`Admin created successfully! \n\nIMPORTANT: The user must also be created in Supabase Auth:\n1. Go to Supabase Dashboard > Authentication > Users\n2. Add user with email: ${formData.email}\n3. Copy the auth user ID and update this admin record`);
      
      setShowCreateForm(false);
      setFormData({
        email: '',
        role: 'support',
        is_active: true
      });
      
      fetchAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Failed to create admin');
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    alert(`Admin Details:\n\nEmail: ${admin.email}\nRole: ${admin.roles[0]}\nStatus: ${admin.is_active ? 'Active' : 'Inactive'}\nCreated: ${new Date(admin.created_at).toLocaleString()}\n\nTo edit: Update the role or status below`);
  };

  const handleToggleStatus = async (adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          is_active: !admin.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminId);

      if (error) throw error;

      // Update local state
      setAdmins(admins.map(a => 
        a.id === adminId ? { ...a, is_active: !a.is_active } : a
      ));
      
      alert(`Admin ${admin.is_active ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status');
    }
  };

  const handleChangeRole = async (adminId: string) => {
    const newRole = prompt('Enter new role (super_admin, manager, support):');
    if (!newRole || !['super_admin', 'manager', 'support'].includes(newRole)) {
      alert('Invalid role. Must be: super_admin, manager, or support');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminId);

      if (error) throw error;

      // Update local state
      setAdmins(admins.map(a => 
        a.id === adminId ? { ...a, roles: [newRole] } : a
      ));
      
      alert('Admin role updated successfully!');
    } catch (error) {
      console.error('Error updating admin role:', error);
      alert('Failed to update admin role');
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      setAdmins(admins.filter(a => a.id !== adminId));
      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin');
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'bg-red-500 text-white';
      case 'manager':
        return 'bg-blue-500 text-white';
      case 'support':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.is_active).length;
  const superAdmins = admins.filter(a => a.roles.includes('super_admin')).length;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Administrators</h1>
          <p className="text-gray-600 mt-1">Control access and permissions for admin users</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Create admin</span>
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Total Admins</h3>
          <p className="text-2xl font-bold">{totalAdmins}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Active Admins</h3>
          <p className="text-2xl font-bold">{activeAdmins}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Super Admins</h3>
          <p className="text-2xl font-bold">{superAdmins}</p>
        </div>
      </div>

      {/* Create Admin Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Administrator</h2>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="support">Support</option>
                  <option value="manager">Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="admin_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="admin_active" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> After creating the admin record, you must also create the corresponding user in Supabase Auth dashboard with the same email address.
              </p>
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
                Create Admin
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
                  Role name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading administrators...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No administrators found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {admin.roles.map((role, index) => (
                          <span
                            key={index}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(role)}`}
                          >
                            {role.replace('_', ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(admin.id)}
                          className={`px-2 py-1 text-xs rounded ${
                            admin.is_active
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {admin.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                        >
                          <span>👁</span>
                        </button>
                        <button
                          onClick={() => handleChangeRole(admin.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                        >
                          <span>🔄</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        >
                          <span>🗑</span>
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