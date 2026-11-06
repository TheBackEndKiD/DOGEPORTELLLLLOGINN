import React, { useState, useEffect } from 'react';

interface ScheduleItem {
  id: string;
  name: string;
  time_hours: number;
  description?: string;
  is_active: boolean;
}

// Default time units for investment calculations
const defaultScheduleItems: ScheduleItem[] = [
  { id: '1', name: 'Hour', time_hours: 1, description: 'Hourly calculations', is_active: true },
  { id: '2', name: 'Day', time_hours: 24, description: 'Daily interest calculations', is_active: true },
  { id: '3', name: '2 Days', time_hours: 48, description: 'Every 2 days', is_active: true },
  { id: '4', name: '3 Days', time_hours: 72, description: 'Every 3 days', is_active: true },
  { id: '5', name: 'Week', time_hours: 168, description: 'Weekly calculations', is_active: true },
  { id: '6', name: '2 Weeks', time_hours: 336, description: 'Bi-weekly calculations', is_active: true },
  { id: '7', name: '3 Weeks', time_hours: 504, description: 'Every 3 weeks', is_active: true },
  { id: '8', name: 'Month', time_hours: 720, description: 'Monthly calculations (30 days)', is_active: true },
  { id: '9', name: '3 Months', time_hours: 2160, description: 'Quarterly calculations', is_active: true },
  { id: '10', name: 'Year', time_hours: 8760, description: 'Annual calculations', is_active: false }
];

export default function Schedule() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    time_hours: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    // Load schedule from localStorage or use defaults
    const savedSchedule = localStorage.getItem('schedule_items');
    if (savedSchedule) {
      try {
        setScheduleItems(JSON.parse(savedSchedule));
      } catch (error) {
        setScheduleItems(defaultScheduleItems);
      }
    } else {
      setScheduleItems(defaultScheduleItems);
      localStorage.setItem('schedule_items', JSON.stringify(defaultScheduleItems));
    }
    setLoading(false);
  }, []);

  const saveSchedule = (newSchedule: ScheduleItem[]) => {
    localStorage.setItem('schedule_items', JSON.stringify(newSchedule));
    setScheduleItems(newSchedule);
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.time_hours) {
      alert('Please fill in all required fields');
      return;
    }

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      name: formData.name,
      time_hours: Number(formData.time_hours),
      description: formData.description,
      is_active: formData.is_active
    };

    const updatedSchedule = [...scheduleItems, newItem];
    saveSchedule(updatedSchedule);

    resetForm();
    alert('Schedule unit created successfully!');
  };

  const handleUpdateUnit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem) return;

    const updatedSchedule = scheduleItems.map(item =>
      item.id === editingItem.id ? {
        ...item,
        name: formData.name,
        time_hours: Number(formData.time_hours),
        description: formData.description,
        is_active: formData.is_active
      } : item
    );

    saveSchedule(updatedSchedule);
    resetForm();
    alert('Schedule unit updated successfully!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      time_hours: '',
      description: '',
      is_active: true
    });
    setShowCreateForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      time_hours: item.time_hours.toString(),
      description: item.description || '',
      is_active: item.is_active
    });
    setShowCreateForm(true);
  };

  const handleDelete = (itemId: string) => {
    if (!confirm('Are you sure you want to delete this schedule unit?')) return;

    const updatedSchedule = scheduleItems.filter(item => item.id !== itemId);
    saveSchedule(updatedSchedule);
    alert('Schedule unit deleted successfully!');
  };

  const handleToggleStatus = (itemId: string) => {
    const updatedSchedule = scheduleItems.map(item =>
      item.id === itemId ? { ...item, is_active: !item.is_active } : item
    );
    saveSchedule(updatedSchedule);
  };

  const formatTime = (hours: number) => {
    if (hours < 24) return `${hours} Hours`;
    if (hours < 168) return `${Math.round(hours / 24)} Days`;
    if (hours < 720) return `${Math.round(hours / 168)} Weeks`;
    if (hours < 8760) return `${Math.round(hours / 720)} Months`;
    return `${Math.round(hours / 8760)} Years`;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
          <p className="text-gray-600 mt-1">Configure time units for investment calculations</p>
        </div>
        
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingItem(null);
            resetForm();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Unit</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingItem ? 'Edit Schedule Unit' : 'Add New Schedule Unit'}
          </h2>
          <form onSubmit={editingItem ? handleUpdateUnit : handleAddUnit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Day, Week, Month"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time in Hours *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.time_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, time_hours: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="24"
                />
                {formData.time_hours && (
                  <p className="text-xs text-gray-500 mt-1">
                    = {formatTime(Number(formData.time_hours))}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Optional description for this time unit"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {editingItem ? 'Update Unit' : 'Add Unit'}
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time (Hours)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equivalent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                    Loading schedule...
                  </td>
                </tr>
              ) : scheduleItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.time_hours} Hours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatTime(item.time_hours)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    {item.description && (
                      <div className="truncate">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          item.is_active
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {item.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Total Units</h3>
          <p className="text-2xl font-bold">{scheduleItems.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Active Units</h3>
          <p className="text-2xl font-bold">{scheduleItems.filter(s => s.is_active).length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-1">Shortest Unit</h3>
          <p className="text-2xl font-bold">
            {Math.min(...scheduleItems.map(s => s.time_hours))}h
          </p>
        </div>
      </div>
    </div>
  );
}