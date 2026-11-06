import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

const mockTemplates: EmailTemplate[] = [
  { id: '1', name: 'PASSWORD RESET', subject: 'Password Reset Code' },
  { id: '2', name: 'PAYMENT SUCCESSFUL', subject: 'PAYMENT SUCCESSFUL' },
  { id: '3', name: 'PAYMENT RECEIVED', subject: 'PAYMENT RECEIVED' },
  { id: '4', name: 'VERIFY EMAIL', subject: 'Verify Your Email' },
  { id: '5', name: 'PAYMENT CONFIRMED', subject: 'payment confirmed' },
  { id: '6', name: 'PAYMENT REJECTED', subject: 'payment rejected' },
  { id: '7', name: 'RETURN INTEREST', subject: 'Return Interest' },
  { id: '8', name: 'WITHDRAW ACCEPTED', subject: 'withdraw Accepted' },
  { id: '9', name: 'WITHDRAW REJECTED', subject: 'withdraw Rejected' },
  { id: '10', name: 'COMMISSION', subject: 'Commission' }
];

export default function EmailTemplates() {
  const handleEditTemplate = (templateId: string) => {
    alert(`Editing email template ${templateId}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
        <p className="text-gray-600">Manage your automated email templates</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTemplates.map((template, index) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditTemplate(template.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center space-x-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}