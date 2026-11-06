import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Ticket {
  id: string;
  customer: string;
  customer_email: string;
  subject: string;
  message: string;
  status: 'pending';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export default function PendingTickets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchPendingTickets();
  }, []);

  const fetchPendingTickets = async () => {
    if (!supabase) return;

    try {
      // Fetch unread notifications as support tickets
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles(username, email)
        `)
        .eq('is_read', false)
        .in('type', ['info', 'warning', 'error'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedTickets = data.map((notif: any) => ({
          id: notif.id,
          customer: notif.profiles?.username || 'Unknown',
          customer_email: notif.profiles?.email || 'N/A',
          subject: notif.title,
          message: notif.message,
          status: 'pending' as const,
          priority: notif.type === 'error' ? 'high' as const : 
                   notif.type === 'warning' ? 'medium' as const : 'low' as const,
          created_at: notif.created_at
        }));
        setTickets(formattedTickets);
      }
    } catch (error) {
      console.error('Error fetching pending tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      // Mark notification as read (resolved)
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', ticketId);

      if (error) throw error;

      // If there's a response, create a new notification as response
      if (response.trim() && selectedTicket) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
          await supabase
            .from('notifications')
            .insert({
              user_id: (await supabase
                .from('profiles')
                .select('id')
                .eq('email', ticket.customer_email)
                .single()).data?.id,
              title: `Re: ${ticket.subject}`,
              message: response,
              type: 'info',
              is_read: false
            });
        }
      }

      // Remove from pending list
      setTickets(tickets.filter(t => t.id !== ticketId));
      setSelectedTicket(null);
      setResponse('');
      alert('Ticket resolved successfully!');
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket');
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pending Support Tickets</h1>
        
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={fetchPendingTickets}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
          >
            🔍
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created at
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
                        Loading tickets...
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No pending tickets found
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr 
                        key={ticket.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ticket.customer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate">{ticket.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveTicket(ticket.id);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ticket Details Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ticket Details</h3>
          
          {selectedTicket ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="text-gray-900">{selectedTicket.customer}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedTicket.customer_email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-gray-900">{selectedTicket.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-900 text-sm">{selectedTicket.message}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedTicket.priority === 'high' ? 'bg-red-100 text-red-800' :
                  selectedTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedTicket.priority}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter your response (optional)..."
                />
              </div>

              <button
                onClick={() => handleResolveTicket(selectedTicket.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium"
              >
                Mark as Resolved
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Select a ticket to view details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}